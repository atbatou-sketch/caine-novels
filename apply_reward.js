const fs = require('fs');
let code = fs.readFileSync('src/components/Comments.tsx', 'utf8');

// 1. Add isFirst to CommentNode
code = code.replace(
  'replies?: ReplyNode[];',
  'replies?: ReplyNode[];\n  isFirst?: boolean;'
);

// 2. Replace post handler
const oldHandlerRegex = /const handlePostComment\s*=\s*\([^)]*\)\s*=>\s*\{[\s\S]*?setNewComment\(""\);\s*\};/m;
const newHandler = `const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const isFirstEver = comments.length === 0;

    const newObj: CommentNode = {
      id: Math.random().toString(36).substring(2, 11),
      text: newComment,
      userName: currentUserName,
      createdAt: new Date().toISOString(),
      replies: [],
      isFirst: isFirstEver
    };

    if (isFirstEver && currentUserName !== "كين العبقري" && currentUserName !== "مدير") {
      newObj.replies.push({
        id: Math.random().toString(36).substring(2, 11),
        text: \`🎉 أسطورة يا \${currentUserName}! يسعدني أنك أول من ترك تعليقاً هنا. كين يحييك شخصياً ويمنحك وسام "القارئ الأول"! 🦇🔥\`,
        userName: "كين العبقري",
        createdAt: new Date(Date.now() + 1000).toISOString()
      });
    }

    saveToStorage([newObj, ...comments]);
    setNewComment("");
  };`;

if (!oldHandlerRegex.test(code)) {
    console.log("Could not find handlePostComment");
}
code = code.replace(oldHandlerRegex, newHandler);

// 3. Add UI badge
const badgeHtml = `{isAdmin && itemOwner === currentUserName && <span className="text-xs text-red-500 bg-red-900/30 px-2 py-0.5 rounded font-bold">أدمن</span>}
             {item.isFirst && !isReply && <span className="text-[10px] md:text-xs text-yellow-400 bg-yellow-900/30 px-2 py-0.5 rounded font-bold border border-yellow-700/50 shadow-[0_0_8px_rgba(234,179,8,0.3)]">🥇 القارئ الأول</span>}`;

code = code.replace(
  '{isAdmin && itemOwner === currentUserName && <span className="text-xs text-red-500 bg-red-900/30 px-2 py-0.5 rounded font-bold">أدمن</span>}',
  badgeHtml
);

// 4. Highlight the first comment box
code = code.replace(
  'className="bg-gray-900/40 p-5 rounded-xl border border-gray-800/60 shadow-md"',
  'className={`bg-gray-900/40 p-5 rounded-xl border shadow-md transition-all duration-500 ${comment.isFirst ? "border-yellow-600/50 shadow-[0_4px_15px_rgba(234,179,8,0.1)] bg-gradient-to-br from-gray-900/40 to-yellow-900/10" : "border-gray-800/60"}`}'
);

fs.writeFileSync('src/components/Comments.tsx', code, 'utf8');
console.log("Changes applied successfully!");
