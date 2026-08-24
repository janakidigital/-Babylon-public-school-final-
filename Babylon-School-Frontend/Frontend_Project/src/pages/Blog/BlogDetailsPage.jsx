import { Link, useParams } from "react-router-dom";
import PageBanner from "../../components/common/PageBanner";
import ArticleLayout from "../../components/shared/ArticleLayout";
import EmptyState from "../../components/common/EmptyState";
import { publicApi } from "../../services/api";
import usePublicData from "../../hooks/usePublicData";
import { formatDateParts } from "../../lib/format";

export default function BlogDetailsPage() {
  const { id } = useParams();
  const { data: post, loading } = usePublicData(
    () => (id ? publicApi.newsOne(id) : Promise.resolve({ data: null })),
    null,
    [id],
  );

  if (loading) {
    return (
      <>
        <PageBanner eyebrow="NEWS" title="Loading..." image="banner/inner_banner_1.jpg" />
        <section className="shell listing-page">
          <p>Loading story...</p>
        </section>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <PageBanner eyebrow="NEWS" title="Story not found." image="banner/inner_banner_1.jpg" />
        <section className="shell listing-page">
          <EmptyState title="This story is not available" />
          <Link className="text-link" to="/blog">
            Back to news <b>&rarr;</b>
          </Link>
        </section>
      </>
    );
  }

  const date = formatDateParts(post.publishedAt || post.createdAt);
  return (
    <>
      <PageBanner
        eyebrow={post.category || "SCHOOL STORY"}
        title={post.title}
        image={post.image || "banner/inner_banner_1.jpg"}
      />
      <ArticleLayout
        image={post.image || "blog/blog_1.jpg"}
        label={`${date.full}${post.author ? ` · ${post.author}` : ""}`}
        title={post.title}
      >
        {post.shortDescription && <p>{post.shortDescription}</p>}
        {(post.content || "").split("\n").map((para, index) =>
          para.trim() ? <p key={index}>{para}</p> : null,
        )}
      </ArticleLayout>
    </>
  );
}
