export const ReportsModel = {
  tableName: 'reports',
  fields: [
    { name: 'date', type: 'date', label: 'Date' },
    { name: 'embroideryReturn', type: 'text', label: 'Embroidery Return' },
    { name: 'fresh', type: 'text', label: 'Fresh' },
    { name: 'Rgrade', type: 'text', label: 'R Grade' },
    { name: 'buildWhat', type: 'text', label: 'Build What' }
  ]
};