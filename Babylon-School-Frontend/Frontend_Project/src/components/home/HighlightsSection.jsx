// import { publicApi } from "../../services/api";
// import usePublicData from "../../hooks/usePublicData";
// import { useSite } from "../../context/SiteContext";
// import EmptyState from "../common/EmptyState";

// export default function HighlightsSection() {
//   const { home } = useSite();
//   const { data, loading } = usePublicData(publicApi.achievements, []);
//   const stats = home?.statistics?.length
//     ? home.statistics
//     : data.map((item) => ({
//         value: item.year || item.value || "",
//         label: item.title || item.label,
//       }));

//   return (
//     <section className="highlights">
//       <div className="shell">
//         <div>
//           <p className="eyebrow light">OUR ACHIEVEMENTS</p>
//           <h2>Growing with purpose and pride.</h2>
//         </div>
//         {loading ? (
//           <p>Loading achievements...</p>
//         ) : stats.length === 0 ? (
//           <EmptyState
//             title="Achievements will appear here"
//           />
//         ) : (
//           <div className="highlight-numbers">
//             {stats.map((item) => (
//               <div key={item.label}>
//                 <strong>{item.value}</strong>
//                 <span>{item.label}</span>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
