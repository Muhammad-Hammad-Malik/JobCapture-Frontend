export default function CompanyLine({ job }) {
  return (
    <>
      {job.company}
      {job.isCompanyNameFallback && <> <span className="fallback-note">(posted by — no company listed)</span></>}
    </>
  );
}
