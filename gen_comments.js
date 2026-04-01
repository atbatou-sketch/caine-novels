const fs = require('fs');

const code = 
"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";

type ReplyNode = {
  id: string;
  text: string;
  userName: string;
  createdAt: string;
};

type CommentNode = {
  id: string;
  text: string;
  userName: string;
  createdAt: string;
  replies?: ReplyNode[];
  isFirst?: boolean;
};

export default function Comments({ novelId }: { novelId: string }) {
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserName, setCurrentUserName] = useState("قارئ غامض");

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("caine-user-name");
    if (savedName) setCurrentUserName(savedName);
    
    // Realtime connection to Firebase Firestore
    const q = query(collection(db, \
ovels/\/comments\), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const dbComments: any[] = [];
      snapshot.forEach((doc) => {
        dbComments.push({ id: doc.id, ...doc.data() });
      });
      setComments(dbComments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [novelId]);

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const isFirstEver = comments.length === 0;
    const parentReplies: ReplyNode[] = [];

    if (isFirstEver && currentUserName !== "كين العبقري" && currentUserName !== "مدير") {
      parentReplies.push({
        id: Math.random().toString(36).substring(2, 11),
        text: \🎉 أسطورة يا \! يسعدني أنك أول من ترك تعليقاً هنا. كين يحييك شخصياً ويمنحك وسام "القارئ الأول"! 🔥\,
        userName: "كين العبقري",
        createdAt: new Date(Date.now() + 1000).toISOString()
      });
    }

    try {
      await addDoc(collection(db, \
ovels/\/comments\), {
        text: newComment,
        userName: currentUserName,
        createdAt: new Date().toISOString(),
        replies: parentReplies,
        isFirst: isFirstEver
      });
      setNewComment("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string, parentId?: string) => {
    if (!confirm("هل أنت متأكد من مسح هذا التعليق؟")) return;

    if (parentId) {
      const parentDoc = comments.find(c => c.id === parentId);
      if (!parentDoc) return;
      const updatedReplies = (parentDoc.replies || []).filter(r => r.id !== id);
      try {
        await updateDoc(doc(db, \
ovels/\/comments\, parentId), { replies: updatedReplies });
      } catch (err) {}
    } else {
      try {
        await deleteDoc(doc(db, \
ovels/\/comments\, id));
      } catch (err) {}
    }
  };

  const handleClearAll = async () => {
    if (!confirm("هل أنت متأكد من مسح جميع التعليقات في هذه الرواية؟ لا يمكن التراجع عن هذا!")) return;
    try {
       const batch = writeBatch(db);
       comments.forEach(c => {
         batch.delete(doc(db, \
ovels/\/comments\, c.id));
       });
       await batch.commit();
    } catch (err) {}
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
    setReplyingToId(null);
  };

  const submitEdit = async (id: string, parentId?: string) => {
    if (!editText.trim()) return;

    if (parentId) {
      const parentDoc = comments.find(c => c.id === parentId);
      if (!parentDoc) return;
      const updatedReplies = (parentDoc.replies || []).map((r: any) => r.id === id ? { ...r, text: editText } : r);
      try {
        await updateDoc(doc(db, \
ovels/\/comments\, parentId), { replies: updatedReplies });
      } catch(err) {}
    } else {
      try {
        await updateDoc(doc(db, \
ovels/\/comments\, id), { text: editText });
      } catch (err) {}
    }
    setEditingId(null);
    setEditText("");
  };

  const submitReply = async (parentId: string) => {
    if (!replyText.trim()) return;

    const newReply: ReplyNode = {
      id: Math.random().toString(36).substring(2, 11),
      text: replyText,
      userName: currentUserName,
      createdAt: new Date().toISOString()
    };

    const parentDoc = comments.find(c => c.id === parentId);
    if (!parentDoc) return;

    try {
      await updateDoc(doc(db, \
ovels/\/comments\, parentId), {
        replies: [...(parentDoc.replies || []), newReply]
      });
    } catch (err) {}

    setReplyingToId(null);
    setReplyText("");
  };

  const renderCommentBody = (item: any, isReply = false, parentId?: string) => {
    const isEditing = editingId === item.id;
    const isAdmin = currentUserName === "كين العبقري" || currentUserName === "مدير";
    const itemOwner = typeof item.userName === 'string' ? item.userName : (item.user?.name || "مجهول");
    const isMyComment = itemOwner === currentUserName || isAdmin;
    const displayUserName = typeof item.userName === 'string' ? item.userName : (item.user?.name || "مجهول");

    return (
      <div className="flex-1 w-full" dir="rtl">
        <div className="flex justify-between items-start mb-2">
          <span className="font-bold text-gray-300 gap-2 flex items-center">
             {displayUserName} {isReply && <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded font-normal">رد</span>}
             {isAdmin && itemOwner === currentUserName && <span className="text-xs text-red-500 bg-red-900/30 px-2 py-0.5 rounded font-bold">أدمن</span>}
             {item.isFirst && !isReply && <span className="text-[10px] md:text-xs text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded font-bold border border-yellow-700/50 shadow-[0_0_8px_rgba(234,179,8,0.3)]">🥇 القارئ الأول</span>}
          </span>
          <span className="text-xs text-gray-600">
            {new Date(item.createdAt).toLocaleDateString("ar-SA", { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {isEditing ? (
           <div className="mt-2 text-right">
             <textarea
               value={editText}
               onChange={e => setEditText(e.target.value)}
               className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg p-3 focus:border-red-900 outline-none h-20"
             ></textarea>
             <div className="flex gap-2 justify-end mt-2">
               <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700">إلغاء</button>
               <button onClick={() => submitEdit(item.id, parentId)} className="text-xs px-3 py-1.5 rounded-lg bg-red-700 text-white hover:bg-red-800">حفظ التعديل</button>
             </div>
           </div>
        ) : (
          <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{item.text}</p>
        )}

        {!isEditing && (
          <div className="flex justify-end gap-3 mt-3 border-t border-gray-800/40 pt-2">
             {!isReply && (
               <button onClick={() => { setReplyingToId(item.id); setEditingId(null); setReplyText(''); }} className="text-sm text-blue-500 hover:text-blue-400 font-bold transition-colors">
                  رد ↩
               </button>
             )}
             {isMyComment && (
                <div className="flex gap-3">
                  <button onClick={() => startEdit(item.id, item.text)} className="text-sm text-yellow-500 hover:text-yellow-400 opacity-70 transition-opacity font-bold">تعديل</button>
                  <button onClick={() => handleDelete(item.id, parentId)} className="text-sm text-red-500 hover:text-red-400 opacity-70 transition-opacity font-bold">مسح</button>
                </div>
             )}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="text-center p-8 text-gray-500">جاري تحميل التعليقات من الخادم العالمي... 🦇</div>;

  const isAdmin = currentUserName === "كين العبقري" || currentUserName === "مدير";

  return (
    <div className="mt-10 border-t border-gray-800 pt-8" dir="rtl">
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-2xl font-bold text-white flex items-center gap-2">
           التعليقات (مباشر) <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
         </h3>
         {isAdmin && comments.length > 0 && (
           <button onClick={handleClearAll} className="px-4 py-2 bg-red-900/40 border border-red-700 text-red-100 rounded-lg hover:bg-red-800 transition-colors font-bold text-sm">
             🔥 مسح كل التعليقات (أدمن)
           </button>
         )}
      </div>

      <form onSubmit={handlePostComment} className="mb-10">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={\اكتب تعليقك هنا كـ "\"...\}
          className="w-full bg-[#1b1c2a] border border-[#2b2d42] text-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-red-900 outline-none transition-all resize-none h-32 shadow-inner"
        />
        <button
          type="submit"
          className="mt-3 px-8 py-3 bg-red-900 hover:bg-red-800 text-white rounded-xl font-bold transition-colors shadow-lg shadow-red-900/20 w-full sm:w-auto"
        >
          نشر التعليق ☁️
        </button>
      </form>

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="bg-[#1b1c2a] rounded-2xl border border-gray-800 p-5 shadow-lg shadow-black/40">
            {renderCommentBody(comment, false)}

            {replyingToId === comment.id && (
              <div className="mt-4 mr-0 md:mr-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="اكتب ردك..."
                  className="w-full bg-gray-900 border border-gray-700 text-gray-200 rounded-lg p-3 focus:border-blue-900 outline-none h-20 mb-2"
                ></textarea>
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setReplyingToId(null)} className="text-xs px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 font-bold">إلغاء</button>
                  <button onClick={() => submitReply(comment.id)} className="text-xs px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-600 font-bold">إرسال الرد</button>
                </div>
              </div>
            )}

            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-3 mr-4 md:mr-10 pl-2 md:pl-0 border-r-2 border-gray-800/60 pb-2">
                <h4 className="text-xs text-gray-500 font-bold mr-4 mb-2">الردود:</h4>
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="bg-[#1e2030] rounded-xl p-4 mr-4 border border-gray-800 shadow-sm relative">
                    <div className="absolute top-4 -right-4 w-4 h-px bg-gray-800/60"></div>
                    {renderCommentBody(reply, true, comment.id)}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {comments.length === 0 && (
          <div className="text-center py-20 text-gray-600 border border-dashed border-gray-800 rounded-2xl">
             كن أول من يعلق في السيرفر العالمي! ☁️
          </div>
        )}
      </div>
    </div>
  );
}
;

fs.writeFileSync('src/components/Comments.tsx', code, 'utf8');
