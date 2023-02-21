export interface GfsRecordHeader {
  discipline: number
  disciplineName: string
  gribEdition: number
  gribLength: number
  center: number
  centerName: string
  subcenter: number
  refTime: Date
  significanceOfRT: number
  significanceOfRTName: string
  productStatus: number
  productStatusName: string
  productType: number
  productTypeName: string
  productDefinitionTemplate: number
  productDefinitionTemplateName: string
  parameterCategory: number
  parameterCategoryName: string
  parameterNumber: number
  parameterNumberName: string
  parameterUnit: string
  genProcessType: number
  genProcessTypeName: string
  forecastTime: number
  surface1Type: number
  surface1TypeName: string
  surface1Value: number
  surface2Type: number
  surface2TypeName: string
  surface2Value: number
  gridDefinitionTemplate: number
  gridDefinitionTemplateName: string
  numberPoints: number
  shape: number
  shapeName: string
  gridUnits: string
  resolution: number
  winds: string
  scanMode: number
  nx: number
  ny: number
  basicAngle: number
  lo1: number
  la1: number
  lo2: number
  la2: number
  dx: number
  dy: number
}

export interface GfsRecord {
  header: GfsRecordHeader
  data: number[]
}

export type GfsDataset = GfsRecord[]
