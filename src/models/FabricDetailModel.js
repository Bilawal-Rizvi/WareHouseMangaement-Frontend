export const FabricDetailModel = {
  tableName: 'fabric_detail',
  fields: [
    { name: 'date', type: 'date', label: 'Date' },
    { name: 'item', type: 'text', label: 'Item' },
    { name: 'party', type: 'text', label: 'Party' },
    { name: 'duying', type: 'text', label: 'Duying' },
    { name: 'rateNo', type: 'text', label: 'Rate NO' },
    { name: 'total', type: 'number', label: 'Total' },
    { name: 'base', type: 'text', label: 'Base' },
    { name: 'advance', type: 'number', label: 'Advance' },
    { name: 'packing', type: 'text', label: 'Packing' },
    { name: 'duyingThane', type: 'text', label: 'Duying/Thane' }
  ]
};