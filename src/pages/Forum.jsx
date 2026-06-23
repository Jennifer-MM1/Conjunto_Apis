import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useFetch } from '../hooks/useFetch';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/ErrorState';
import { Card3D } from '../components/ui/Card3D';
import { MessageSquare, Send, Plus, User, MessageCircle, AlertCircle } from 'lucide-react';

export const Forum = () => {
  const [localPosts, setLocalPosts] = useState([]);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [commentsMap, setCommentsMap] = useState({});
  const [commentsLoadingMap, setCommentsLoadingMap] = useState({});
  
  // Create post form state
  const [newTitle, setNewTitle] = useState('');
  const [newBody, setNewBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch initial posts
  const fetchPosts = React.useCallback(() => {
    return api.forum.getPosts(10);
  }, []);

  const { data: postsData, loading, error, execute } = useFetch(fetchPosts, true);

  // Sync server posts to local state to allow new local additions
  useEffect(() => {
    if (postsData) {
      setLocalPosts(postsData);
    }
  }, [postsData]);

  // Load comments for a post when expanded
  const handleToggleExpand = async (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }

    setExpandedPostId(postId);

    // Fetch comments only if they aren't loaded yet
    if (!commentsMap[postId]) {
      setCommentsLoadingMap(prev => ({ ...prev, [postId]: true }));
      try {
        const comments = await api.forum.getComments(postId);
        setCommentsMap(prev => ({ ...prev, [postId]: comments }));
      } catch (err) {
        console.error(err);
      } finally {
        setCommentsLoadingMap(prev => ({ ...prev, [postId]: false }));
      }
    }
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newBody.trim()) {
      setFormError('Por favor, completa todos los campos del formulario.');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    // Simulate API Response & Add to top of posts list
    setTimeout(() => {
      const simulatedPost = {
        userId: 1,
        id: Date.now(), // Unique ID
        title: newTitle,
        body: newBody,
        isSimulated: true
      };

      setLocalPosts(prev => [simulatedPost, ...prev]);
      setNewTitle('');
      setNewBody('');
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-100">
          📝 Foro Social de la Comunidad
        </h2>
        <p className="text-slate-400 text-xs mt-1">
          Simulación de una mini red social o foro. Renderiza posts ficticios de JSONPlaceholder, despliega comentarios asociados y simula la creación de nuevos posts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Posts List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">
            Publicaciones Recientes
          </h3>

          {error ? (
            <ErrorState message={error} onRetry={execute} />
          ) : loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(n => (
                <div key={n} className="glass-panel p-6 rounded-2xl space-y-3">
                  <Skeleton variant="title" />
                  <Skeleton variant="text" />
                  <Skeleton variant="text" className="w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            localPosts.map((post) => {
              const isExpanded = expandedPostId === post.id;
              const comments = commentsMap[post.id] || [];
              const commentsLoading = commentsLoadingMap[post.id];

              return (
                <div
                  key={post.id}
                  className={`glass-panel rounded-2xl border transition-all duration-300 ${
                    post.isSimulated
                      ? 'border-brand-cyan/20 bg-brand-cyan/[0.01]'
                      : 'border-slate-800/80 hover:border-slate-700/60'
                  }`}
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-400">
                          <User size={14} />
                        </div>
                        <span className="text-xs font-bold text-slate-400">
                          {post.isSimulated ? 'Tú (Usuario Local)' : `Usuario #${post.userId}`}
                        </span>
                      </div>
                      {post.isSimulated && (
                        <span className="text-[10px] font-bold text-brand-cyan uppercase bg-brand-cyan/15 px-2 py-0.5 rounded border border-brand-cyan/30">
                          Simulado
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-base font-extrabold text-slate-100 leading-snug">
                        {post.title}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed text-justify">
                        {post.body}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 border-t border-slate-850 pt-4">
                      <button
                        onClick={() => handleToggleExpand(post.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-250 cursor-pointer ${
                          isExpanded
                            ? 'bg-slate-900 text-brand-cyan border border-brand-cyan/20'
                            : 'bg-slate-900/60 hover:bg-slate-900 border border-slate-850 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <MessageSquare size={14} />
                        <span>Comentarios</span>
                        <span className="bg-slate-800 px-1.5 py-0.2 rounded font-mono text-[10px]">
                          {post.isSimulated ? 0 : comments.length || '...'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Expandable Comments Accordion */}
                  {isExpanded && (
                    <div className="border-t border-slate-850/80 bg-slate-900/10 px-6 py-4 space-y-4">
                      {commentsLoading ? (
                        <div className="space-y-3 py-2">
                          <Skeleton variant="text" />
                          <Skeleton variant="text" className="w-1/2" />
                        </div>
                      ) : post.isSimulated ? (
                        <div className="text-center py-4 text-xs text-slate-500 italic">
                          Esta publicación es simulada localmente y aún no tiene comentarios.
                        </div>
                      ) : comments.length === 0 ? (
                        <div className="text-center py-4 text-xs text-slate-500">
                          No hay comentarios en esta publicación.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Respuestas
                          </span>
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                            {comments.map((comm) => (
                              <div
                                key={comm.id}
                                className="p-3 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2"
                              >
                                <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold font-mono">
                                  <span className="text-slate-400 truncate max-w-[150px]">
                                    👤 {comm.name}
                                  </span>
                                  <span className="truncate max-w-[120px]">{comm.email}</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed text-justify">
                                  {comm.body}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Creator panel */}
        <div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">
            Crear Publicación
          </h3>

          <form
            onSubmit={handleCreatePost}
            className="glass-panel p-6 rounded-2xl border-slate-800/80 space-y-4 sticky top-24"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Título del post
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Escribe un título..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-cyan/60"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Contenido
              </label>
              <textarea
                value={newBody}
                onChange={(e) => setNewBody(e.target.value)}
                placeholder="Escribe el cuerpo del post..."
                rows={5}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-brand-cyan/60 resize-none"
              />
            </div>

            {formError && (
              <div className="flex items-center gap-2 p-2.5 bg-brand-pink/10 border border-brand-pink/20 rounded-xl text-[10px] text-brand-pink font-semibold">
                <AlertCircle size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-5 py-2.5 bg-gradient-to-r from-brand-violet to-brand-cyan hover:from-brand-violet/90 hover:to-brand-cyan/90 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 active:scale-95 disabled:opacity-40 cursor-pointer flex items-center justify-center gap-2 text-xs"
            >
              <Send size={14} />
              {isSubmitting ? 'Publicando...' : 'Publicar Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Forum;
