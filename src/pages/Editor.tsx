import { useState, useCallback, useEffect, useRef, DragEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered,
  Code, Link as LinkIcon, Image, Table, Quote, Minus, Download,
  Plus, Search, Trash2, FileText, Maximize, Minimize,
  ChevronLeft, ChevronRight, AlignLeft, FolderPlus, Folder,
  FolderOpen, GripVertical, MoreHorizontal, Pencil, Eye, EyeOff,
  PanelLeftClose, PanelLeft, Copy, ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ─── Types ────────────────────────────────────────────────────────

interface NoteFolder {
  id: string;
  name: string;
  order: number;
}

interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  updatedAt: number;
  createdAt: number;
  order: number;
}

// ─── Helpers ──────────────────────────────────────────────────────

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, data: unknown) {
  localStorage.setItem(key, JSON.stringify(data));
}

const DEFAULT_CONTENT = `# Welcome to PMNT

Start writing your markdown here. Use the toolbar above or keyboard shortcuts:

- **Bold**: Ctrl+B
- *Italic*: Ctrl+I
- [Links](https://example.com)
- \`inline code\`

## Features

1. Live split preview
2. Auto-save to local storage
3. Export as .md file
4. Zen mode for distraction-free writing

> "The scariest moment is always just before you start." — Stephen King

Happy writing! ✍️
`;

const toolbarActions = [
  { icon: Bold, label: "Bold", prefix: "**", suffix: "**", shortcut: "b" },
  { icon: Italic, label: "Italic", prefix: "*", suffix: "*", shortcut: "i" },
  { icon: Heading1, label: "H1", prefix: "# ", suffix: "", shortcut: "1" },
  { icon: Heading2, label: "H2", prefix: "## ", suffix: "", shortcut: "2" },
  { icon: Heading3, label: "H3", prefix: "### ", suffix: "", shortcut: "3" },
  { icon: List, label: "Bullet List", prefix: "- ", suffix: "", shortcut: "" },
  { icon: ListOrdered, label: "Numbered List", prefix: "1. ", suffix: "", shortcut: "" },
  { icon: Quote, label: "Quote", prefix: "> ", suffix: "", shortcut: "" },
  { icon: Code, label: "Code", prefix: "`", suffix: "`", shortcut: "" },
  { icon: LinkIcon, label: "Link", prefix: "[", suffix: "](url)", shortcut: "k" },
  { icon: Image, label: "Image", prefix: "![alt](", suffix: ")", shortcut: "" },
  { icon: Table, label: "Table", prefix: "\n| Header | Header |\n| ------ | ------ |\n| Cell   | Cell   |\n", suffix: "", shortcut: "" },
  { icon: Minus, label: "Divider", prefix: "\n---\n", suffix: "", shortcut: "" },
];

// ─── Component ────────────────────────────────────────────────────

const Editor = () => {
  const [folders, setFolders] = useState<NoteFolder[]>(() => load("pmnt-folders", []));
  const [notes, setNotes] = useState<Note[]>(() => load("pmnt-notes-v2", []));
  const [activeId, setActiveId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zenMode, setZenMode] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [mobileView, setMobileView] = useState<"sidebar" | "editor" | "preview">("sidebar");
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [dragOverTarget, setDragOverTarget] = useState<string | null>(null);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [folderDialogOpen, setFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [renameNoteDialog, setRenameNoteDialog] = useState<{ id: string; title: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Migrate old notes
  useEffect(() => {
    if (notes.length === 0) {
      const oldNotes = load<any[]>("pmnt-notes", []);
      if (oldNotes.length > 0) {
        const migrated = oldNotes.map((n, i) => ({
          ...n,
          folderId: n.folderId ?? null,
          order: n.order ?? i,
        }));
        setNotes(migrated);
        persist("pmnt-notes-v2", migrated);
      } else {
        const first: Note = {
          id: uid(),
          title: "Welcome",
          content: DEFAULT_CONTENT,
          folderId: null,
          updatedAt: Date.now(),
          createdAt: Date.now(),
          order: 0,
        };
        setNotes([first]);
        setActiveId(first.id);
        persist("pmnt-notes-v2", [first]);
      }
    } else if (!activeId) {
      setActiveId(notes[0]?.id || null);
    }
  }, []);

  // Persist
  useEffect(() => { persist("pmnt-notes-v2", notes); }, [notes]);
  useEffect(() => { persist("pmnt-folders", folders); }, [folders]);

  const activeNote = notes.find((n) => n.id === activeId);

  // ─── Notes CRUD ─────────────────────────────────────────────────

  const updateNote = useCallback(
    (updates: Partial<Note>) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === activeId ? { ...n, ...updates, updatedAt: Date.now() } : n))
      );
    },
    [activeId]
  );

  const createNote = useCallback(
    (folderId: string | null = null) => {
      const note: Note = {
        id: uid(),
        title: "Untitled",
        content: "",
        folderId,
        updatedAt: Date.now(),
        createdAt: Date.now(),
        order: notes.length,
      };
      setNotes((prev) => [note, ...prev]);
      setActiveId(note.id);
      if (folderId) setExpandedFolders((prev) => new Set(prev).add(folderId));
      if (isMobile) setMobileView("editor");
    },
    [notes.length, isMobile]
  );

  const duplicateNote = useCallback(
    (id: string) => {
      const original = notes.find((n) => n.id === id);
      if (!original) return;
      const copy: Note = {
        ...original,
        id: uid(),
        title: `${original.title} (copy)`,
        updatedAt: Date.now(),
        createdAt: Date.now(),
        order: notes.length,
      };
      setNotes((prev) => [copy, ...prev]);
      setActiveId(copy.id);
    },
    [notes]
  );

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const next = prev.filter((n) => n.id !== id);
        if (activeId === id) setActiveId(next[0]?.id || null);
        return next;
      });
    },
    [activeId]
  );

  const moveNoteToFolder = useCallback(
    (noteId: string, folderId: string | null) => {
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, folderId, updatedAt: Date.now() } : n))
      );
    },
    []
  );

  // ─── Folders CRUD ───────────────────────────────────────────────

  const createFolder = useCallback(() => {
    if (!newFolderName.trim()) return;
    const folder: NoteFolder = { id: uid(), name: newFolderName.trim(), order: folders.length };
    setFolders((prev) => [...prev, folder]);
    setExpandedFolders((prev) => new Set(prev).add(folder.id));
    setNewFolderName("");
    setFolderDialogOpen(false);
  }, [newFolderName, folders.length]);

  const renameFolder = useCallback(
    (id: string, name: string) => {
      setFolders((prev) => prev.map((f) => (f.id === id ? { ...f, name } : f)));
      setEditingFolderId(null);
    },
    []
  );

  const deleteFolder = useCallback(
    (id: string) => {
      setFolders((prev) => prev.filter((f) => f.id !== id));
      setNotes((prev) => prev.map((n) => (n.folderId === id ? { ...n, folderId: null } : n)));
    },
    []
  );

  const toggleFolder = useCallback((id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  // ─── Drag & Drop ───────────────────────────────────────────────

  const handleNoteDragStart = (e: DragEvent, noteId: string) => {
    e.dataTransfer.setData("note-id", noteId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleFolderDrop = (e: DragEvent, folderId: string | null) => {
    e.preventDefault();
    setDragOverTarget(null);
    const noteId = e.dataTransfer.getData("note-id");
    if (noteId) moveNoteToFolder(noteId, folderId);
  };

  const handleDragOver = (e: DragEvent, target: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverTarget(target);
  };

  // ─── Export ─────────────────────────────────────────────────────

  const exportNote = useCallback(() => {
    if (!activeNote) return;
    const blob = new Blob([activeNote.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeNote.title.replace(/[^a-z0-9]/gi, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [activeNote]);

  // ─── Markdown Insert ───────────────────────────────────────────

  const insertMarkdown = useCallback(
    (prefix: string, suffix: string) => {
      const ta = textareaRef.current;
      if (!ta || !activeNote) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const selected = activeNote.content.slice(start, end);
      const replacement = prefix + (selected || "text") + suffix;
      const newContent = activeNote.content.slice(0, start) + replacement + activeNote.content.slice(end);
      updateNote({ content: newContent });
      setTimeout(() => {
        ta.focus();
        ta.setSelectionRange(start + prefix.length, start + prefix.length + (selected || "text").length);
      }, 0);
    },
    [activeNote, updateNote]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === "Escape" && zenMode) { setZenMode(false); return; }
      const action = toolbarActions.find((a) => a.shortcut === e.key);
      if (action) { e.preventDefault(); insertMarkdown(action.prefix, action.suffix); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [insertMarkdown, zenMode]);

  // ─── Filter ─────────────────────────────────────────────────────

  const q = searchQuery.toLowerCase();
  const filteredNotes = notes.filter(
    (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  );
  const unfolderedNotes = filteredNotes.filter((n) => !n.folderId).sort((a, b) => b.updatedAt - a.updatedAt);
  const notesInFolder = (fid: string) => filteredNotes.filter((n) => n.folderId === fid).sort((a, b) => b.updatedAt - a.updatedAt);

  const wordCount = activeNote?.content.trim().split(/\s+/).filter(Boolean).length || 0;
  const charCount = activeNote?.content.length || 0;

  // ─── Note Item Component ───────────────────────────────────────

  const NoteItem = ({ note }: { note: Note }) => (
    <div
      draggable
      onDragStart={(e) => handleNoteDragStart(e, note.id)}
      onClick={() => {
        setActiveId(note.id);
        if (isMobile) setMobileView("editor");
      }}
      className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${
        note.id === activeId
          ? "bg-accent/10 border border-accent/20"
          : "hover:bg-muted/50 border border-transparent"
      }`}
    >
      <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-grab" />
      <FileText className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium truncate">{note.title}</p>
        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
          {note.content.slice(0, 50).replace(/[#*_`\[\]]/g, "").trim() || "Empty note"}
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-all"
          >
            <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => setRenameNoteDialog({ id: note.id, title: note.title })}>
            <Pencil className="h-3.5 w-3.5 mr-2" /> Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => duplicateNote(note.id)}>
            <Copy className="h-3.5 w-3.5 mr-2" /> Duplicate
          </DropdownMenuItem>
          {folders.length > 0 && (
            <>
              <DropdownMenuSeparator />
              {note.folderId && (
                <DropdownMenuItem onClick={() => moveNoteToFolder(note.id, null)}>
                  <FileText className="h-3.5 w-3.5 mr-2" /> Move to root
                </DropdownMenuItem>
              )}
              {folders
                .filter((f) => f.id !== note.folderId)
                .map((f) => (
                  <DropdownMenuItem key={f.id} onClick={() => moveNoteToFolder(note.id, f.id)}>
                    <Folder className="h-3.5 w-3.5 mr-2" /> Move to {f.name}
                  </DropdownMenuItem>
                ))}
            </>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => deleteNote(note.id)} className="text-destructive focus:text-destructive">
            <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  // ─── Sidebar Content ───────────────────────────────────────────

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-border/50 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-serif text-base font-semibold">Notes</span>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setFolderDialogOpen(true)} title="New folder">
              <FolderPlus className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => createNote(null)} title="New note">
              <Plus className="h-3.5 w-3.5" />
            </Button>
            {!isMobile && (
              <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setSidebarOpen(false)}>
                <PanelLeftClose className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            className="pl-8 h-8 text-xs rounded-lg bg-muted/50 border-border/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Scrollable list */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
        {/* Folders */}
        {folders.map((folder) => (
          <div
            key={folder.id}
            onDragOver={(e) => handleDragOver(e, folder.id)}
            onDragLeave={() => setDragOverTarget(null)}
            onDrop={(e) => handleFolderDrop(e, folder.id)}
            className={`rounded-lg transition-colors ${dragOverTarget === folder.id ? "bg-accent/10 ring-1 ring-accent/30" : ""}`}
          >
            <div className="flex items-center gap-1.5 px-2 py-1.5 group">
              <button onClick={() => toggleFolder(folder.id)} className="p-0.5">
                <ChevronDown
                  className={`h-3 w-3 text-muted-foreground transition-transform duration-200 ${
                    expandedFolders.has(folder.id) ? "" : "-rotate-90"
                  }`}
                />
              </button>
              {expandedFolders.has(folder.id) ? (
                <FolderOpen className="h-3.5 w-3.5 text-accent shrink-0" />
              ) : (
                <Folder className="h-3.5 w-3.5 text-accent shrink-0" />
              )}
              {editingFolderId === folder.id ? (
                <input
                  autoFocus
                  defaultValue={folder.name}
                  className="flex-1 text-[13px] font-medium bg-transparent outline-none border-b border-accent"
                  onBlur={(e) => renameFolder(folder.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") renameFolder(folder.id, (e.target as HTMLInputElement).value);
                    if (e.key === "Escape") setEditingFolderId(null);
                  }}
                />
              ) : (
                <span className="flex-1 text-[13px] font-medium truncate">{folder.name}</span>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-muted transition-all">
                    <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => createNote(folder.id)}>
                    <Plus className="h-3.5 w-3.5 mr-2" /> New note
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setEditingFolderId(folder.id)}>
                    <Pencil className="h-3.5 w-3.5 mr-2" /> Rename
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => deleteFolder(folder.id)} className="text-destructive focus:text-destructive">
                    <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {expandedFolders.has(folder.id) && (
              <div className="ml-5 pl-2 border-l border-border/40 space-y-0.5 pb-1">
                {notesInFolder(folder.id).map((note) => (
                  <NoteItem key={note.id} note={note} />
                ))}
                {notesInFolder(folder.id).length === 0 && (
                  <p className="text-[11px] text-muted-foreground/50 py-2 px-3 italic">No notes</p>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Unfoldered notes */}
        <div
          onDragOver={(e) => handleDragOver(e, "root")}
          onDragLeave={() => setDragOverTarget(null)}
          onDrop={(e) => handleFolderDrop(e, null)}
          className={`space-y-0.5 ${dragOverTarget === "root" ? "bg-accent/5 rounded-lg" : ""}`}
        >
          {folders.length > 0 && unfolderedNotes.length > 0 && (
            <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-semibold px-3 pt-3 pb-1">
              Unfiled
            </p>
          )}
          {unfolderedNotes.map((note) => (
            <NoteItem key={note.id} note={note} />
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-8">
            <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-xs text-muted-foreground/60">
              {searchQuery ? "No matching notes" : "No notes yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  // ─── Mobile Layout ──────────────────────────────────────────────

  if (isMobile || (typeof window !== "undefined" && window.innerWidth < 768)) {
    return (
      <div className="h-screen flex flex-col bg-background">
        {!zenMode && <Navbar />}

        <div className={`flex-1 flex flex-col overflow-hidden ${!zenMode ? "pt-20" : ""}`}>
          {mobileView === "sidebar" && (
            <div className="flex-1 overflow-hidden">
              <SidebarContent />
            </div>
          )}

          {mobileView === "editor" && activeNote && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Mobile toolbar */}
              <div className="border-b border-border/50 bg-card px-3 py-2 flex items-center gap-1">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setMobileView("sidebar")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <input
                  value={activeNote.title}
                  onChange={(e) => updateNote({ title: e.target.value })}
                  className="bg-transparent outline-none font-medium text-sm flex-1 min-w-0"
                  placeholder="Note title..."
                />
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setMobileView("preview")}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={exportNote}>
                  <Download className="h-4 w-4" />
                </Button>
              </div>
              {/* Mobile formatting bar */}
              <div className="border-b border-border/30 bg-card/50 px-2 py-1.5 flex gap-0.5 overflow-x-auto">
                {toolbarActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => insertMarkdown(action.prefix, action.suffix)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
                  >
                    <action.icon className="h-4 w-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
              <textarea
                ref={textareaRef}
                value={activeNote.content}
                onChange={(e) => updateNote({ content: e.target.value })}
                className="flex-1 resize-none bg-background p-4 font-mono text-sm leading-relaxed outline-none"
                placeholder="Start writing..."
                spellCheck={false}
              />
              <div className="border-t border-border/50 bg-card px-4 py-1.5 flex justify-between text-[11px] text-muted-foreground">
                <span>{wordCount} words · {charCount} chars</span>
                <span>Markdown</span>
              </div>
            </div>
          )}

          {mobileView === "preview" && activeNote && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="border-b border-border/50 bg-card px-3 py-2 flex items-center gap-2">
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setMobileView("editor")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">{activeNote.title} — Preview</span>
              </div>
              <div className="flex-1 overflow-y-auto p-5 markdown-preview">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeNote.content}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        {/* Dialogs */}
        <FolderDialog
          open={folderDialogOpen}
          onOpenChange={setFolderDialogOpen}
          value={newFolderName}
          onChange={setNewFolderName}
          onSubmit={createFolder}
        />
        <RenameDialog
          data={renameNoteDialog}
          onClose={() => setRenameNoteDialog(null)}
          onRename={(id, title) => {
            setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, title, updatedAt: Date.now() } : n)));
            setRenameNoteDialog(null);
          }}
        />
      </div>
    );
  }

  // ─── Desktop Layout ─────────────────────────────────────────────

  return (
    <div className="h-screen flex flex-col bg-background">
      {!zenMode && <Navbar />}

      <div className={`flex flex-1 overflow-hidden ${!zenMode ? "pt-[72px]" : ""}`}>
        {/* Sidebar */}
        {!zenMode && sidebarOpen && (
          <div className="w-64 border-r border-border/50 bg-card/50 flex flex-col shrink-0">
            <SidebarContent />
          </div>
        )}

        {/* Main Editor */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="border-b border-border/50 bg-card/80 backdrop-blur-sm px-3 py-2 flex items-center gap-1 flex-wrap">
            {!sidebarOpen && !zenMode && (
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 mr-1" onClick={() => setSidebarOpen(true)}>
                <PanelLeft className="h-4 w-4" />
              </Button>
            )}

            {activeNote && (
              <>
                <input
                  value={activeNote.title}
                  onChange={(e) => updateNote({ title: e.target.value })}
                  className="bg-transparent border-none outline-none font-medium text-sm mr-3 w-44"
                  placeholder="Note title..."
                />

                <div className="h-5 w-px bg-border/50 mx-1" />

                <div className="flex items-center gap-0.5">
                  {toolbarActions.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => insertMarkdown(action.prefix, action.suffix)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      title={action.label + (action.shortcut ? ` (Ctrl+${action.shortcut.toUpperCase()})` : "")}
                    >
                      <action.icon className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>

                <div className="flex-1" />

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0"
                  onClick={() => setShowPreview(!showPreview)}
                  title={showPreview ? "Hide preview" : "Show preview"}
                >
                  {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={exportNote} title="Export .md">
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setZenMode(!zenMode)} title="Zen Mode">
                  {zenMode ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </>
            )}
          </div>

          {/* Editor + Preview */}
          {activeNote ? (
            <div className="flex-1 flex overflow-hidden">
              <div className={`flex flex-col min-w-0 ${showPreview ? "flex-1" : "w-full"}`}>
                <textarea
                  ref={textareaRef}
                  value={activeNote.content}
                  onChange={(e) => updateNote({ content: e.target.value })}
                  className="flex-1 resize-none bg-background p-6 font-mono text-sm leading-relaxed outline-none custom-scrollbar"
                  placeholder="Start writing markdown..."
                  spellCheck={false}
                />
              </div>

              {showPreview && (
                <>
                  <div className="w-px bg-border/50" />
                  <div className="flex-1 overflow-y-auto p-6 custom-scrollbar markdown-preview">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{activeNote.content}</ReactMarkdown>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <AlignLeft className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p className="font-serif text-xl mb-3">No note selected</p>
                <Button onClick={() => createNote(null)} variant="outline" size="sm" className="rounded-xl">
                  <Plus className="h-4 w-4 mr-1" /> Create a note
                </Button>
              </div>
            </div>
          )}

          {/* Status Bar */}
          <div className="border-t border-border/50 bg-card/80 px-4 py-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>{wordCount} words</span>
              <span>{charCount} characters</span>
              {activeNote?.folderId && (
                <span className="text-accent">
                  📁 {folders.find((f) => f.id === activeNote.folderId)?.name}
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>Markdown</span>
              {zenMode && (
                <button onClick={() => setZenMode(false)} className="hover:text-foreground transition-colors">
                  Exit Zen · Esc
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <FolderDialog
        open={folderDialogOpen}
        onOpenChange={setFolderDialogOpen}
        value={newFolderName}
        onChange={setNewFolderName}
        onSubmit={createFolder}
      />
      <RenameDialog
        data={renameNoteDialog}
        onClose={() => setRenameNoteDialog(null)}
        onRename={(id, title) => {
          setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, title, updatedAt: Date.now() } : n)));
          setRenameNoteDialog(null);
        }}
      />
    </div>
  );
};

// ─── Sub-components ───────────────────────────────────────────────

function FolderDialog({
  open,
  onOpenChange,
  value,
  onChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif">New Folder</DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          placeholder="Folder name..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          className="rounded-lg"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-xl">
            Cancel
          </Button>
          <Button onClick={onSubmit} className="bg-foreground text-background hover:bg-foreground/90 rounded-xl">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RenameDialog({
  data,
  onClose,
  onRename,
}: {
  data: { id: string; title: string } | null;
  onClose: () => void;
  onRename: (id: string, title: string) => void;
}) {
  const [value, setValue] = useState("");
  useEffect(() => {
    if (data) setValue(data.title);
  }, [data]);

  return (
    <Dialog open={!!data} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-serif">Rename Note</DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && data && onRename(data.id, value)}
          className="rounded-lg"
        />
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={() => data && onRename(data.id, value)}
            className="bg-foreground text-background hover:bg-foreground/90 rounded-xl"
          >
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default Editor;
