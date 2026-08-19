"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "../../lib/i18n";

type Collection = { id: string; name: string; description: string | null; itemCount: number };
type Item = { promptId: string; slug: string | null; title: string | null; summary: string | null; unavailable: boolean };

export default function LibraryCollectionsClient({ locale, collections, selected, items }: { locale: Locale; collections: Collection[]; selected: Collection | null; items: Item[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedName, setSelectedName] = useState(selected?.name ?? "");
  const [description, setDescription] = useState(selected?.description ?? "");
  const [status, setStatus] = useState("");
  const isEnglish = locale === "en";
  const text = isEnglish ? {
    create: "Create collection", name: "Collection name", description: "Description (optional)", empty: "Create your first private collection.",
    update: "Save changes", remove: "Remove", delete: "Delete collection", unavailable: "This prompt is no longer available.", items: "items", confirm: "Delete this collection? Its prompts will remain untouched.",
  } : {
    create: "Tạo bộ sưu tập", name: "Tên bộ sưu tập", description: "Mô tả (không bắt buộc)", empty: "Hãy tạo bộ sưu tập riêng đầu tiên.",
    update: "Lưu thay đổi", remove: "Gỡ", delete: "Xóa bộ sưu tập", unavailable: "Prompt này không còn khả dụng.", items: "mục", confirm: "Xóa bộ sưu tập này? Prompt vẫn được giữ nguyên.",
  };

  async function create() {
    const value = name.trim();
    if (!value) return setStatus(isEnglish ? "Enter a name." : "Hãy nhập tên.");
    setStatus(isEnglish ? "Creating…" : "Đang tạo…");
    const response = await fetch("/api/library/collections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: value }) });
    const result = await response.json().catch(() => null);
    if (!response.ok) return setStatus(result?.error ?? (isEnglish ? "Could not create collection." : "Không thể tạo bộ sưu tập."));
    router.push(`/library/collections?collection=${result.collection.id}`);
    router.refresh();
  }
  async function update() {
    if (!selected) return;
    setStatus(isEnglish ? "Saving…" : "Đang lưu…");
    const response = await fetch(`/api/library/collections/${selected.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: selectedName, description }) });
    const result = await response.json().catch(() => null);
    if (!response.ok) return setStatus(result?.error ?? (isEnglish ? "Could not save collection." : "Không thể lưu bộ sưu tập."));
    setStatus(isEnglish ? "Saved." : "Đã lưu."); router.refresh();
  }
  async function removeItem(promptId: string) {
    if (!selected) return;
    const response = await fetch(`/api/library/collections/${selected.id}/items/${promptId}`, { method: "DELETE" });
    const result = await response.json().catch(() => null);
    setStatus(response.ok ? (isEnglish ? "Removed from collection." : "Đã gỡ khỏi bộ sưu tập.") : (result?.error ?? (isEnglish ? "Could not remove item." : "Không thể gỡ mục này.")));
    if (response.ok) router.refresh();
  }
  async function deleteCollection() {
    if (!selected || !window.confirm(text.confirm)) return;
    const response = await fetch(`/api/library/collections/${selected.id}`, { method: "DELETE" });
    const result = await response.json().catch(() => null);
    if (!response.ok) return setStatus(result?.error ?? (isEnglish ? "Could not delete collection." : "Không thể xóa bộ sưu tập."));
    router.push("/library/collections"); router.refresh();
  }

  return <div className="library-collections-layout">
    <aside className="library-collection-list"><div className="workspace-create"><label>{text.name}<input maxLength={80} value={name} onChange={(event) => setName(event.target.value)} /></label><button type="button" onClick={create}>{text.create}</button></div>
      {collections.length ? <ul>{collections.map((collection) => <li key={collection.id}><Link href={`/library/collections?collection=${collection.id}`} aria-current={selected?.id === collection.id ? "page" : undefined}><strong>{collection.name}</strong><span>{collection.itemCount} {text.items}</span></Link></li>)}</ul> : <p>{text.empty}</p>}
    </aside>
    <section className="library-collection-content" aria-live="polite">{selected ? <>
      <div className="library-collection-heading"><div><p className="route-kicker">{isEnglish ? "PRIVATE COLLECTION" : "BỘ SƯU TẬP RIÊNG"}</p><h2>{selected.name}</h2></div><button type="button" className="danger-action" onClick={deleteCollection}>{text.delete}</button></div>
      <label>{text.name}<input maxLength={80} value={selectedName} onChange={(event) => setSelectedName(event.target.value)} /></label>
      <label>{text.description}<textarea maxLength={280} value={description} onChange={(event) => setDescription(event.target.value)} /></label><button type="button" onClick={update}>{text.update}</button>
      <div className="collection-items">{items.length ? items.map((item) => <article key={item.promptId} className="collection-item">{item.unavailable ? <p>{text.unavailable}</p> : <div><h3><Link href={`/prompts/${item.slug}`}>{item.title}</Link></h3><p>{item.summary}</p></div>}<button type="button" onClick={() => removeItem(item.promptId)}>{text.remove}</button></article>) : <p>{isEnglish ? "No prompts in this collection yet." : "Chưa có prompt trong bộ sưu tập này."}</p>}</div>
    </> : <div className="catalog-empty"><p>{isEnglish ? "Choose a collection or create a new one." : "Chọn một bộ sưu tập hoặc tạo bộ mới."}</p></div>}</section>
    <p className="workspace-status" role="status">{status}</p>
  </div>;
}
