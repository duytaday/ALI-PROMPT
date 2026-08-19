"use client";

import { useEffect, useId, useState } from "react";
import type { Locale } from "../../lib/i18n";

type Collection = { id: string; name: string; description: string | null; itemCount: number };

export default function PromptWorkspaceControls({ promptId, locale }: { promptId: string; locale: Locale }) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionId, setCollectionId] = useState("");
  const [newCollection, setNewCollection] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const collectionInputId = useId();
  const noteId = useId();
  const isEnglish = locale === "en";

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/library/collections", { cache: "no-store" }).then((response) => response.json()),
      fetch(`/api/library/notes/${promptId}`, { cache: "no-store" }).then((response) => response.json()),
    ])
      .then(([collectionResult, noteResult]) => {
        if (!active) return;
        const nextCollections = Array.isArray(collectionResult.collections) ? collectionResult.collections as Collection[] : [];
        setCollections(nextCollections);
        setCollectionId(nextCollections[0]?.id ?? "");
        setNote(typeof noteResult.note === "string" ? noteResult.note : "");
      })
      .catch(() => active && setStatus(isEnglish ? "Your private workspace could not be loaded. Retry shortly." : "Không thể tải không gian riêng. Hãy thử lại sau."))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [isEnglish, promptId]);

  async function createCollection() {
    const name = newCollection.trim();
    if (!name) return setStatus(isEnglish ? "Enter a collection name." : "Hãy nhập tên bộ sưu tập.");
    setStatus(isEnglish ? "Creating…" : "Đang tạo…");
    const response = await fetch("/api/library/collections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.collection) return setStatus(result?.error ?? (isEnglish ? "Could not create collection." : "Không thể tạo bộ sưu tập."));
    setCollections((current) => [result.collection, ...current]);
    setCollectionId(result.collection.id);
    setNewCollection("");
    setStatus(isEnglish ? "Collection created." : "Đã tạo bộ sưu tập.");
  }

  async function addToCollection() {
    if (!collectionId) return setStatus(isEnglish ? "Create a collection first." : "Hãy tạo bộ sưu tập trước.");
    setStatus(isEnglish ? "Saving…" : "Đang lưu…");
    const response = await fetch(`/api/library/collections/${collectionId}/items/${promptId}`, { method: "PUT" });
    const result = await response.json().catch(() => null);
    setStatus(response.ok ? (result?.added ? (isEnglish ? "Added to collection." : "Đã thêm vào bộ sưu tập.") : (isEnglish ? "Already in this collection." : "Prompt đã có trong bộ sưu tập này.")) : (result?.error ?? (isEnglish ? "Could not update collection." : "Không thể cập nhật bộ sưu tập.")));
  }

  async function saveNote() {
    setStatus(isEnglish ? "Saving note…" : "Đang lưu ghi chú…");
    const response = await fetch(`/api/library/notes/${promptId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note }) });
    const result = await response.json().catch(() => null);
    if (!response.ok) return setStatus(result?.error ?? (isEnglish ? "Could not save note." : "Không thể lưu ghi chú."));
    setNote(typeof result.note === "string" ? result.note : "");
    setStatus(result.deleted ? (isEnglish ? "Note deleted." : "Đã xóa ghi chú.") : (isEnglish ? "Note saved." : "Đã lưu ghi chú."));
  }

  return <section className="prompt-workspace" aria-labelledby="prompt-workspace-title">
    <div><p className="route-kicker">{isEnglish ? "PRIVATE WORKSPACE" : "KHÔNG GIAN RIÊNG"}</p><h2 id="prompt-workspace-title">{isEnglish ? "Organize and annotate" : "Sắp xếp và ghi chú"}</h2><p>{isEnglish ? "Collections and notes stay private to your account." : "Bộ sưu tập và ghi chú chỉ hiển thị trong tài khoản của bạn."}</p></div>
    <div className="prompt-workspace-grid">
      <div className="workspace-card">
        <h3>{isEnglish ? "Add to collection" : "Thêm vào bộ sưu tập"}</h3>
        <label htmlFor={collectionInputId}>{isEnglish ? "Collection" : "Bộ sưu tập"}</label>
        <select id={collectionInputId} value={collectionId} disabled={loading || !collections.length} onChange={(event) => setCollectionId(event.target.value)}>
          {collections.length ? collections.map((collection) => <option key={collection.id} value={collection.id}>{collection.name}</option>) : <option>{isEnglish ? "No collections yet" : "Chưa có bộ sưu tập"}</option>}
        </select>
        <button type="button" onClick={addToCollection} disabled={loading || !collections.length}>{isEnglish ? "Add prompt" : "Thêm prompt"}</button>
        <div className="workspace-create"><label>{isEnglish ? "New collection" : "Bộ sưu tập mới"}<input maxLength={80} value={newCollection} onChange={(event) => setNewCollection(event.target.value)} placeholder={isEnglish ? "For example: Marketing" : "Ví dụ: Marketing"} /></label><button type="button" onClick={createCollection}>{isEnglish ? "Create" : "Tạo"}</button></div>
      </div>
      <div className="workspace-card">
        <h3>{isEnglish ? "Private note" : "Ghi chú riêng"}</h3>
        <label htmlFor={noteId}>{isEnglish ? "Plain text, up to 2,000 characters" : "Văn bản thuần, tối đa 2.000 ký tự"}</label>
        <textarea id={noteId} maxLength={2000} value={note} onChange={(event) => setNote(event.target.value)} placeholder={isEnglish ? "What should you remember for next time?" : "Bạn muốn nhớ điều gì cho lần dùng sau?"} />
        <div className="workspace-note-actions"><span>{note.length}/2000</span><button type="button" onClick={saveNote}>{isEnglish ? "Save note" : "Lưu ghi chú"}</button></div>
      </div>
    </div>
    <p className="workspace-status" role="status" aria-live="polite">{status}</p>
  </section>;
}
