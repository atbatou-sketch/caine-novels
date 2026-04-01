const fs = require('fs');

const content = "use client";

import { useState, useEffect } from "react";

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
};

export default function Comments({ novelId }: { novelId: string }) {
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUserName, setCurrentUserName] = useState("???? ????");
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem("caine-user-name");
    if (savedName) setCurrentUserName(savedName);
    fetchComments();
  }, [novelId]);

  const fetchComments = () => {
    try {
      const dbComments = JSON.parse(localStorage.getItem(\\\caine-comments-\\\\\\) || "[]");
      setComments(dbComments.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const saveToStorage = (updatedComments: CommentNode[]) => {
    localStorage.setItem(\\\caine-comments-\\\\\\, JSON.stringify(updatedComments));
    setComments(updatedComments);
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newObj: CommentNode = {
      id: Math.random().toString(36).substring(2, 11),
      text: newComment,
      userName: currentUserName,
      createdAt: new Date().toISOString(),
      replies: []
    };

    saveToStorage([newObj, ...comments]);
    setNewComment("");
  };

  const handleDelete = (id: string, parentId?: string) => {
    if (!confirm("?? ??? ????? ?? ??? ??? ????????")) return;
    
    if (parentId) {
      const updated = comments.map(c => {
        if (c.id === parentId && c.replies) {
          return { ...c, replies: c.replies.filter(r => r.id !== id) };
        }
        return c;
      });
      saveToStorage(updated);
    } else {
      const updated = comments.filter(c => c.id !== id);
      saveToStorage(updated);
    }
  };

  const handleClearAll = () => {
    if (!confirm("?? ??? ????? ?? ??? **????** ????????? ?? ??? ???????? ?? ???? ??????? ?? ???!")) return;
    saveToStorage([]);
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditText(text);
    setReplyingToId(null);
  };

  const submitEdit = (id: string, parentId?: string) => {
    if (!editText.trim()) return;

    let updated = [...comments];
    if (parentId) {
       updated = updated.map(c => {
        if (c.id === parentId && c.replies) {
           return { ...c, replies: c.replies.map(r => r.id === id ? { ...r, text: editText } : r) };
        }
        return c;
      });
    } else {
       updated = updated.map(c => c.id === id ? { ...c, text: editText } : c);
    }

    saveToStorage(updated);
    setEditingId(null);
    setEditText("");
  };

  const submitReply = (parentId: string) => {
    if (!replyText.trim()) return;

    const newReply: ReplyNode = {
      id: Math.random().toString(36).substring(2, 11),
      text: replyText,
      userName: currentUserName,
      createdAt: new Date().toISOString()
    };

    const updated = comments.map(c => {
      if (c.id === parentId) {
        return { ...c, replies: [...(c.replies || []), newReply] };
      }
      return c;
    });

    saveToStorage(updated);
    setReplyingToId(null);
    setReplyText("");
  };

  const renderCommentBody = (item: any, isReply = false, parentId?: string) => {
    const isEditing = editingId === item.id;
    const isMyComment = item.userName === currentUserName || currentUserName === "??? ???????" || currentUserName === "????";

    return (
      <div className="flex-1 w-full" dir="rtl">
        <div className="flex justify-between items-start mb-2">
          <span className="font-bold text-gray-300 gap-2 flex items-center">
             {item.userName} {isReply && <span className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded font-normal">??</span>}
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
               <button onClick={() => setEditingId(null)} className="text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700">?????</button>
               <button onClick={() => submitEdit(item.id, parentId)} className="text-xs px-3 py-1.5 rounded-lg bg-red-700 text-white hover:bg-red-800">??? ???????</button>
             </div>
           </div>
        ) : (
          <p className="text-gray-400 leading-relaxed whitespace-pre-wrap">{item.text}</p>
        )}

        {!isEditing && (
          <div className="flex justify-end gap-3 mt-3">
             {!isReply && (
               <button onClick={() => { setReplyingToId(item.id); setEditingId(null); setReplyText(''); }} className="text-xs text-blue-500 hover:text-blue-400 font-bold transition-colors">
                  ?? ?
               </button>
             )}
             {isMyComment && (
                <>
                  <button onClick={() => startEdit(item.id, item.text)} className="text-xs text-green-500 hover:text-green-400 font-bold transition-colors">
                    ????? ?
                  </button>
                  <button onClick={() => handleDelete(item.id, parentId)} className="text-xs text-red-500 hover:text-red-400 font-bold transition-colors">
                    ??? ??
                  </button>
                </>
             )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mt-12 bg-black/40 border border-red-900/30 p-6 rounded-2xl shadow-xl w-full max-w-4xl mx-auto backdrop-blur-sm" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-red-500 flex items-center gap-2">
          <span>?????????</span>
          <span className="text-sm bg-red-900/50 px-2 py-1 rounded-full text-white/80">
            {comments.length + comments.reduce((acc, c) => acc + (c.replies?.length || 0), 0)}
          </span>
        </h3>
        {comments.length > 0 && (currentUserName === "??? ???????" || currentUserName === "????") && (
            <button onClick={handleClearAll} className="text-xs bg-red-900/40 text-red-400 hover:bg-red-800 hover:text-white px-3 py-1.5 rounded-lg transition-colors border border-red-900/50">
              ??? ?? ????????? (????)
            </button>
        )}
      </div>

      <form onSubmit={handlePostComment} className="mb-8 border-b border-gray-800/50 pb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="???? ?????? ???..."
          className="w-full bg-gray-900/50 border border-gray-800 text-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-red-900 focus:border-transparent outline-none transition-all resize-none h-24"
        ></textarea>
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="mt-3 bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          ??? ???????
        </button>
      </form>

      <div className="space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">???? ???????...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-900/20 p-5 rounded-xl border border-gray-800/60 shadow-md">
              {renderCommentBody(comment, false)}
              
              {replyingToId === comment.id && (
                <div className="mt-4 border-t border-gray-800/50 pt-4 flex flex-col items-end mr-0 md:mr-8">
                   <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="???? ???..."
                    className="w-full bg-gray-900/80 border border-gray-700 text-gray-200 rounded-lg p-3 focus:border-red-900 outline-none h-20 mb-2"
                  ></textarea>
                  <div className="flex gap-2">
                    <button onClick={() => setReplyingToId(null)} className="text-sm px-4 py-1.5 rounded-lg bg-gray-800 text-white hover:bg-gray-700">?????</button>
                    <button onClick={() => submitReply(comment.id)} disabled={!replyText.trim()} className="text-sm px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">????? ????</button>
                  </div>
                </div>
              )}

              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 mr-4 md:mr-10 border-r-2 border-gray-700/50 pr-4 space-y-4">
                  {comment.replies.map(reply => (
                    <div key={reply.id} className="bg-gray-800/20 p-4 rounded-lg border border-gray-700/30">
                       {renderCommentBody(reply, true, comment.id)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 italic py-8">?? ???? ??????? ???... ?? ??? ?? ????.</p>
        )}
      </div>
    </div>
  );
};

fs.writeFileSync('src/components/Comments.tsx', content, 'utf8');
