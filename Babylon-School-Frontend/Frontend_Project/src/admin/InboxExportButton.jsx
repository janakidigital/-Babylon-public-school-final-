import React, { useRef, useState } from "react";
import { Download } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../services/api";
import { downloadInboxExcel } from "../lib/inboxExport";

const labels = {
  admissions: "admission applications",
  contacts: "contact messages",
  "career-applications": "career applications",
};

export default function InboxExportButton({ kind, loading = false }) {
  const [exporting, setExporting] = useState(false);
  const exportInProgress = useRef(false);
  const label = labels[kind];

  async function download() {
    if (loading || exportInProgress.current) return;
    exportInProgress.current = true;
    setExporting(true);

    try {
      // Fetch again so the file includes every submission available at download time.
      const response = await api(`/${kind}`);
      if (!Array.isArray(response.data)) {
        throw new Error("Unable to read submissions. Please try again.");
      }
      if (response.data.length === 0) {
        toast(`No ${label} to download yet.`);
        return;
      }

      const { count } = await downloadInboxExcel(kind, response.data);
      toast.success(`Excel download started for ${count} ${count === 1 ? "submission" : "submissions"}.`);
    } catch (err) {
      toast.error(err.message || "Unable to download the Excel file. Please try again.");
    } finally {
      exportInProgress.current = false;
      setExporting(false);
    }
  }

  return (
    <button
      type="button"
      className="button primary admin-inbox-export"
      onClick={download}
      disabled={loading || exporting}
      aria-busy={exporting}
      title={`Download all ${label} as an Excel file`}
    >
      <Download size={16} aria-hidden="true" />
      {exporting ? "Downloading..." : "Download all (Excel)"}
    </button>
  );
}
