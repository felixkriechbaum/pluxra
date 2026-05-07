export type BlockType = 'value' | 'bar' | 'chart'
export type DataSource = 'push' | 'poll'

export interface Block {
  key: string
  label: string
  type: BlockType
  unit: string
  color: string
  min: number
  max: number
}

export interface CustomConfig {
  title: string
  dataSource: DataSource
  pollUrl: string
  pollInterval: number
  pollHeaders: string
  pollBody: string
  pollMethod: string
  blocks: Block[]
}
