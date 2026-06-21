'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { CommentService } from '@/services/CommentService';
import Avatar from '@/components/common/Avatar';

interface CommentType {
  _id: string;
  user: { _id: string; name: string; isAdmin: boolean; isTeacher: boolean };
  content: string;
  images: string[];
  createdAt: string;
  replies: CommentType[];
}

const CommentText = ({ content }: { content: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 250;
  const shouldTruncate = content.length > maxLength;

  return (
    <div className="mt-1">
      <p className="text-[13px] text-gray-800 whitespace-pre-wrap break-words">
        {shouldTruncate && !isExpanded ? `${content.slice(0, maxLength)}...` : content}
      </p>
      {shouldTruncate && (
        <button 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="text-[#0072BC] font-medium text-[12px] mt-1 hover:underline"
        >
          {isExpanded ? 'Ẩn bớt' : 'Xem thêm'}
        </button>
      )}
    </div>
  );
};

export default function LessonComments({ 
  lessonId, 
  initialComments = [],
  initialTotal = 0,
  initialHasMore = false
}: { 
  lessonId: string, 
  initialComments?: CommentType[],
  initialTotal?: number,
  initialHasMore?: boolean
}) {
  const user = useSelector((state: any) => state.user);
  const [comments, setComments] = useState<CommentType[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [total, setTotal] = useState(initialTotal);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchComments = async (pageNum = 1, shouldAppend = false) => {
    try {
      const res = await CommentService.getCommentsByLesson(lessonId, pageNum, 5);
      if (res.success) {
        if (shouldAppend) {
          setComments(prev => [...prev, ...res.data]);
        } else {
          setComments(res.data);
        }
        setHasMore(res.hasMore);
        setTotal(res.total);
      }
    } catch (error) {
      console.error("Lỗi khi tải bình luận:", error);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchComments(nextPage, true);
  };

  useEffect(() => {
    if (lessonId) {
      if (initialComments.length === 0 && comments.length === 0) {
        setPage(1);
        fetchComments(1, false);
      } else {
        setComments(initialComments);
        setTotal(initialTotal);
        setHasMore(initialHasMore);
      }
    }
  }, [lessonId, initialComments, initialTotal, initialHasMore]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).slice(0, 5);
      setImages(prev => [...prev, ...filesArray].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (parentId: string | null = null) => {
    if (!user || !user.id) {
      alert("Vui lòng đăng nhập để bình luận.");
      return;
    }

    const content = parentId ? replyText : newComment;
    if (!content.trim() && images.length === 0) return;

    try {
      setIsSubmitting(true);
      let uploadedImageUrls: string[] = [];
      
      if (images.length > 0 && !parentId) {
        const uploadRes = await CommentService.uploadImages(images);
        if (uploadRes.success) {
          uploadedImageUrls = uploadRes.urls;
        }
      }

      const userData = {
        _id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isTeacher: user.isTeacher
      };

      await CommentService.createComment(
        lessonId,
        userData,
        content,
        uploadedImageUrls,
        parentId
      );

      if (parentId) {
        setReplyText("");
        setReplyingTo(null);
      } else {
        setNewComment("");
        setImages([]);
      }
      
      setPage(1);
      await fetchComments(1, false);
    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      alert("Có lỗi xảy ra, vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const renderCommentBox = (isReply = false, parentId: string | null = null) => (
    <div className={`flex items-start gap-3 w-full relative z-10 ${isReply ? '' : 'mb-6'}`}>
      <Avatar name={user?.name} size="md" className="mt-1" />
      <div className="flex-grow relative flex flex-col w-full">
        <div className="relative w-full">
          <input
            type="text"
            placeholder={isReply ? "Viết câu trả lời..." : "Viết bình luận"}
            className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-4 pr-24 text-[13px] outline-none focus:border-[#0072BC]"
            value={isReply ? replyText : newComment}
            onChange={(e) => isReply ? setReplyText(e.target.value) : setNewComment(e.target.value)}
            onKeyDown={(e) => {
               if (e.key === 'Enter') handleSubmit(parentId);
            }}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {!isReply && (
              <>
                <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" multiple className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
              </>
            )}
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </button>
            <button onClick={() => handleSubmit(parentId)} disabled={isSubmitting} className="text-[#0072BC] hover:text-[#005a96] ml-1">
              <svg className="w-5 h-5 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
            </button>
          </div>
        </div>
        
        {/* Hiển thị preview ảnh */}
        {!isReply && images.length > 0 && (
           <div className="w-full mt-2 flex gap-2 flex-wrap">
             {images.map((img, idx) => (
               <div key={idx} className="relative w-16 h-16 border rounded overflow-hidden">
                 <img src={URL.createObjectURL(img)} alt="preview" className="w-full h-full object-cover" />
                 <button onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white w-4 h-4 flex items-center justify-center text-xs">x</button>
               </div>
             ))}
           </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-white">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <h3 className="font-bold text-[16px] text-[#0072BC]">
          Thảo luận
        </h3>
        <button onClick={() => { setPage(1); fetchComments(1, false); }} className="text-[#0072BC] hover:text-[#005a96]" title="Làm mới">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>

      {renderCommentBox()}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment._id} className="relative flex gap-3 w-full">
            {/* Đường kẻ dọc nối với replies */}
            {(comment.replies?.length > 0 || replyingTo === comment._id) && (
              <div className="absolute left-[17px] top-[40px] bottom-[-20px] w-px bg-gray-300"></div>
            )}
            
            <Avatar name={comment.user?.name} size="md" className="mt-1 z-10" />
            
            <div className="flex-grow w-full overflow-hidden">
              <div className="bg-gray-50 rounded-2xl p-3 inline-block max-w-[90%]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-[13px] text-[#002b49]">{comment.user?.name || 'Học viên'}</span>
                  {comment.user?.isTeacher && <span className="text-gray-500 text-[11px] font-medium">- Giáo viên</span>}
                </div>
                <CommentText content={comment.content} />
                {comment.images && comment.images.length > 0 && (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {comment.images.map((img, i) => (
                      <img key={i} src={img} alt="attached" className="max-w-full md:max-w-[300px] rounded cursor-pointer border border-gray-200" onClick={() => window.open(img, '_blank')} />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 mt-1.5 ml-1 text-[11px] text-gray-500">
                <button className="flex items-center gap-1 hover:text-[#0072BC] font-medium">
                  <span className="text-yellow-500 text-[13px]">👍</span> Thích (0)
                </button>
                <button onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)} className="flex items-center gap-1 hover:text-[#0072BC] font-medium">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                  {replyingTo === comment._id ? 'Hủy' : 'Trả lời'}
                </button>
                <span>{formatDate(comment.createdAt)}</span>
              </div>

              {/* Danh sách Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3 space-y-4 relative w-full">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="relative flex gap-3 pl-6 w-full">
                      {/* Đường nối rẽ nhánh chữ L ngược */}
                      <div className="absolute left-[-15px] top-[14px] w-[21px] h-px bg-gray-300"></div>
                      
                      <Avatar name={reply.user?.name} size="sm" className="mt-0.5 z-10" />
                      <div className="flex-grow w-full overflow-hidden">
                        <div className="bg-gray-50 rounded-2xl p-2.5 inline-block max-w-[90%]">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-[12px] text-[#002b49]">{reply.user?.name || 'Học viên'}</span>
                            {(reply.user?.isAdmin || reply.user?.isTeacher) && <span className="text-[#0072BC] text-[11px] font-bold">Giáo viên</span>}
                          </div>
                          <CommentText content={reply.content} />
                        </div>
                        <div className="flex items-center gap-4 mt-1.5 ml-1 text-[11px] text-gray-500">
                          <button className="flex items-center gap-1 hover:text-[#0072BC] font-medium">
                            <span className="text-yellow-500 text-[13px]">👍</span> Thích (0)
                          </button>
                          <span>{formatDate(reply.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Box Trả lời */}
              {replyingTo === comment._id && (
                 <div className="mt-4 pl-6 relative w-full">
                   <div className="absolute left-[-15px] top-[18px] w-[21px] h-px bg-gray-300"></div>
                   {renderCommentBox(true, comment._id)}
                 </div>
              )}

            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-center text-gray-500 italic py-8">Chưa có bình luận nào. Hãy là người đầu tiên đặt câu hỏi!</p>
        )}
      </div>
      
      {hasMore && (
        <div className="mt-4 border-t border-gray-100 pt-3 flex justify-center">
          <button onClick={handleLoadMore} className="text-[13px] font-medium text-[#0072BC] hover:text-[#005a96] hover:underline flex items-center gap-1">
            Xem thêm bình luận
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
