import * as XLSX from "xlsx";

export async function xlsxToJson<T>(filepath: string): Promise<T[]> {
  let fileXlsx = XLSX.readFile(filepath, {
    cellDates: true,
  });

  let aba = fileXlsx.Sheets[fileXlsx.SheetNames[0]];
  return XLSX.utils.sheet_to_json(aba);
}
