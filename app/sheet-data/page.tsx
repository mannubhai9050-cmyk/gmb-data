import SheetDataPage from "@/components/SheetDataPage";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    sheetName?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <SheetDataPage
      sheetName={params.sheetName || ""}
    />
  );
}