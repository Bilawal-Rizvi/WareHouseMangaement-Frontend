export const EmbroideryModel = {
  tableName: 'embroidery_details',
  fields: [
    { name: 'embroideryName', type: 'text', label: 'Embroidery Name' },
    { name: 'latNo', type: 'text', label: 'Lat No' },
    { name: 'base', type: 'text', label: 'Base' },
    { name: 'sendingDate', type: 'date', label: 'Sending Date' },
    { name: 'receivingDate', type: 'date', label: 'Receiving Date' },
    { name: 'quantity', type: 'number', label: 'Quantity' },
    { name: 'fresh', type: 'text', label: 'Fresh' },
    { name: 'rGrade', type: 'text', label: 'R Grade' }
  ]
};