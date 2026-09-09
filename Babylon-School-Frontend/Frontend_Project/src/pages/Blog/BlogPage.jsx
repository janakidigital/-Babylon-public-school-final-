import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  ArrowRight, 
  Calendar, 
  User, 
  ChevronRight,
  Clock,
  Tag
} from "lucide-react";
import PageBanner from "../../components/common/PageBanner";
import NoticesSidebar from "../../components/shared/NoticesSidebar";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";
import { richTextToPlainText } from "../../lib/richText";
import { POST_TYPES, getPostType, getPostTypeLabel } from "../../lib/postType";

export default function BlogPage() {
  const { data, loading } = usePublicData(publicApi.news, []);
  const [visibleCount, setVisibleCount] = useState(3);
  const [postType, setPostType] = useState("all");
  const { pathname } = useLocation();
  
  const filteredData = postType === "all" ? data : data.filter(post => getPostType(post) === postType);
  const hasMore = filteredData.length > visibleCount;
  const displayData = filteredData.slice(0, visibleCount);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric',
      timeZone: 'UTC',
    });
  };

  // Get reading time
  const getReadingTime = (text) => {
    text = richTextToPlainText(text);
    if (!text) return "2 min read";
    const wordsPerMinute = 200;
    const words = text.split(/\s/g).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${Math.max(1, minutes)} min read`;
  };

  // Truncate text
  const truncateText = (text, limit = 120) => {
    text = richTextToPlainText(text);
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit).trim() + "..." : text;
  };

  const handleSeeMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  // Check if we're on the home page
  const isHomePage = pathname === '/';

  // Featured post (first post)
  const featuredPost = displayData.length > 0 ? displayData[0] : null;
  const restPosts = displayData.slice(1);

  return (
    <>
      {isHomePage ? (
        // Home Page View
        <section className="blog-home-section">
          <div className="shell">
            <div className="blog-home-header">
              <div className="blog-home-header-left">
                <span className="section-badge">News & Blog</span>
                <h2 className="section-title">Latest News & Blog</h2>
              </div>
              {data.length > 3 && (
                <Link to="/blog" className="blog-home-view-all">
                  View All <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </section>
      ) : (
        // Blog Page View
        <PageBanner
          eyebrow="SCHOOL STORIES"
          title="News & Blog from the Babylon community."
          image="banner/inner_banner_1.jpg"
          pageKey="news"
        />
      )}

      <div className={isHomePage ? "blog-home-container" : "blog-page-modern"}>
        <div className={isHomePage ? "shell" : "blog-container"}>
          {!isHomePage && <NoticesSidebar currentPage="blog" />}
          
          <div className={isHomePage ? "blog-home-content" : "blog-main-content"}>
            <section className="blog-listing">
              {!isHomePage && (
                <div className="blog-filters" role="group" aria-label="Filter stories">
                  {[{ value: "all", label: "All" }, ...POST_TYPES].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      aria-pressed={postType === option.value}
                      onClick={() => {
                        setPostType(option.value);
                        setVisibleCount(3);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
              {loading ? (
                <div className="blog-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading stories...</p>
                </div>
              ) : filteredData.length === 0 ? (
                <EmptyState
                  title={postType === "blog" ? "No blog posts yet" : postType === "news" ? "No news yet" : "No news or blog posts yet"}
                  
                />
              ) : (
                <>
                  {/* Featured Post - Only on blog page */}
                  {!isHomePage && featuredPost && (
                    <div className="blog-featured">
                      <Link 
                        to={`/blog-details/${featuredPost._id || featuredPost.id}`}
                        className="blog-featured-card"
                      >
                        <div className="blog-featured-image">
                          <img
                            src={
                              featuredPost.image 
                                ? mediaUrl(featuredPost.image) 
                                : `${assetPath}blog/blog_1.jpg`
                            }
                            alt={featuredPost.title || "Featured post"}
                          />
                          <div className="blog-featured-badge">{getPostTypeLabel(featuredPost)} · Featured</div>
                        </div>
                        <div className="blog-featured-content">
                          <div className="blog-featured-meta">
                            {featuredPost.category && (
                              <span className="meta-item"><Tag size={16} />{featuredPost.category}</span>
                            )}
                            <span className="meta-item">
                              <Calendar size={16} />
                              {formatDate(featuredPost.publishedAt || featuredPost.createdAt || featuredPost.date)}
                            </span>
                            <span className="meta-item">
                              <User size={16} />
                              {featuredPost.author || "Admin"}
                            </span>
                            <span className="meta-item">
                              <Clock size={16} />
                              {getReadingTime(featuredPost.description || featuredPost.content)}
                            </span>
                          </div>
                          <h2 className="blog-featured-title">
                            {featuredPost.title || "Untitled"}
                          </h2>
                          <p className="blog-featured-description">
                            {truncateText(featuredPost.shortDescription || featuredPost.description || featuredPost.content || "", 180)}
                          </p>
                          <span className="blog-featured-link">
                            Read Full Story <ArrowRight size={18} />
                          </span>
                        </div>
                      </Link>
                    </div>
                  )}

                  {/* Blog Grid */}
                  <div className={isHomePage ? "blog-grid-home" : "blog-grid-modern"}>
                    {(isHomePage ? displayData : restPosts).map((post, index) => {
                      const postId = post._id || post.id;
                      return (
                        <Link
                          key={postId || index}
                          to={`/blog-details/${postId}`}
                          className={isHomePage ? "blog-card-home" : "blog-card-modern"}
                          style={{ animationDelay: `${index * 0.08}s` }}
                        >
                          <div className="blog-card-image">
                            <img
                              src={
                                post.image 
                                  ? mediaUrl(post.image) 
                                  : `${assetPath}blog/blog_${(index % 3) + 1}.jpg`
                              }
                              alt={post.title || `${getPostTypeLabel(post)} post`}
                              onError={(e) => {
                                e.target.src = `${assetPath}blog/blog_${(index % 3) + 1}.jpg`;
                              }}
                            />
                            <div className="blog-card-badge">
                              {getPostTypeLabel(post)}
                            </div>
                          </div>
                          
                          <div className="blog-card-content">
                            <div className="blog-card-meta">
                              {post.category && (
                                <span className="meta-item"><Tag size={14} />{post.category}</span>
                              )}
                              <span className="meta-item">
                                <Calendar size={14} />
                                {formatDate(post.publishedAt || post.createdAt || post.date)}
                              </span>
                              <span className="meta-item">
                                <User size={14} />
                                {post.author || "Admin"}
                              </span>
                            </div>
                            
                            <h3 className="blog-card-title">
                              {post.title || "Untitled"}
                            </h3>
                            
                            <p className="blog-card-description">
                              {truncateText(post.shortDescription || post.description || post.content || "", 110)}
                            </p>
                            
                            <div className="blog-card-footer">
                              <span className="blog-card-link">
                                Read More <ArrowRight size={16} />
                              </span>
                              <span className="blog-card-read-time">
                                <Clock size={14} />
                                {getReadingTime(post.description || post.content)}
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* See More / View All Button */}
                  {!isHomePage && hasMore && (
                    <div className="blog-footer">
                      <button
                        type="button"
                        className="btn-see-more"
                        onClick={handleSeeMore}
                      >
                        <span>Load More Stories</span>
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}

                  {/* View All on Home Page */}
                  {isHomePage && data.length > 3 && (
                    <div className="blog-footer">
                      <Link to="/blog" className="btn-view-all-blog">
                        <span>View All Stories</span>
                        <ArrowRight size={18} />
                      </Link>
                    </div>
                  )}
                </>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
