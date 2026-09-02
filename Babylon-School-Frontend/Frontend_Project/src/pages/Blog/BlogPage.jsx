import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Calendar, 
  User, 
  ChevronRight,
  Clock,
  Eye,
  Tag
} from "lucide-react";
import PageBanner from "../../components/common/PageBanner";
import NoticesSidebar from "../../components/shared/NoticesSidebar";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { mediaUrl } from "../../lib/media";
import { assetPath } from "../../data/content";

export default function BlogPage() {
  const { data, loading } = usePublicData(publicApi.news, []);
  const [visibleCount, setVisibleCount] = useState(3);
  
  const hasMore = data.length > visibleCount;
  const displayData = data.slice(0, visibleCount);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get reading time
  const getReadingTime = (text) => {
    if (!text) return "2 min read";
    const wordsPerMinute = 200;
    const words = text.split(/\s/g).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${Math.max(1, minutes)} min read`;
  };

  // Truncate text
  const truncateText = (text, limit = 120) => {
    if (!text) return "";
    return text.length > limit ? text.slice(0, limit).trim() + "..." : text;
  };

  const handleSeeMore = () => {
    setVisibleCount(prev => prev + 3);
  };

  // Check if we're on the home page
  const isHomePage = window.location.pathname === '/';

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
                <span className="section-badge"> Blog</span>
                <h2 className="section-title">Latest Blog</h2>
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
              {loading ? (
                <div className="blog-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading stories...</p>
                </div>
              ) : data.length === 0 ? (
                <EmptyState
                  title="No news yet"
                  text="Stories published from the admin panel will appear here."
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
                          <div className="blog-featured-badge">Featured</div>
                        </div>
                        <div className="blog-featured-content">
                          <div className="blog-featured-meta">
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
                            {truncateText(featuredPost.shortDescription || featuredPost.description || "", 180)}
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
                              alt={post.title || "Blog post"}
                              onError={(e) => {
                                e.target.src = `${assetPath}blog/blog_${(index % 3) + 1}.jpg`;
                              }}
                            />
                            <div className="blog-card-badge">
                              {post.category || "News"}
                            </div>
                          </div>
                          
                          <div className="blog-card-content">
                            <div className="blog-card-meta">
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
                              {truncateText(post.shortDescription || post.description || "", 110)}
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
                  {!isHomePage && (hasMore || data.length > 3) && (
                    <div className="blog-footer">
                      {hasMore && (
                        <button 
                          className="btn-see-more"
                          onClick={handleSeeMore}
                        >
                          <span>Load More Stories</span>
                          <ChevronRight size={18} />
                        </button>
                      )}
                      
                      {!hasMore && data.length > 3 && (
                        <Link to="/blog" className="btn-view-all-blog">
                          <span>View All Stories</span>
                          <ArrowRight size={18} />
                        </Link>
                      )}
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