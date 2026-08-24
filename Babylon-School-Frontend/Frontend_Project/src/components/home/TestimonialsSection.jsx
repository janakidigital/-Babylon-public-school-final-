import { publicApi } from "../../services/api";
import { mediaUrl } from "../../lib/media";
import usePublicData from "../../hooks/usePublicData";
import EmptyState from "../common/EmptyState";

export default function TestimonialsSection() {
  const { data, loading } = usePublicData(publicApi.testimonials, []);
  return (
    <section className="testimonials shell">
      <div className="center-heading">
        <p className="eyebrow">OUR COMMUNITY</p>
        <h2>What parents say</h2>
      </div>
      {loading ? (
        <p>Loading testimonials...</p>
      ) : data.length === 0 ? (
        <EmptyState
          title="No testimonials yet"
          text="Parent and student voices added in admin will appear here."
        />
      ) : (
        <div className="testimonial-grid">
          {data.map((item) => (
            <blockquote key={item._id || item.name}>
              “{item.message}”
              <div className="testimonial-footer" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                {item.image && (
                  <img 
                    src={mediaUrl(item.image)} 
                    alt={item.name} 
                    style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span>{item.name}</span>
                  {item.designation && (
                    <span style={{ fontWeight: 'normal', color: 'var(--muted)', textTransform: 'capitalize' }}>
                      {item.designation}
                    </span>
                  )}
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      )}
    </section>
  );
}
