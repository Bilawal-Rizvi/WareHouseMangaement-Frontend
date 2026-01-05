export const PackingModel = {
  tableName: 'packing',
  fields: [
    { name: 'date', type: 'date', label: 'Date' },
    { name: 'latNo', type: 'text', label: 'Lat NO' },
    { name: 'volumeNo', type: 'text', label: 'Volume No' },
    { name: 'quantity', type: 'number', label: 'Quantity' },
    { name: 'Agrade', type: 'text', label: 'A Grade' },
    { name: 'Bgrade', type: 'text', label: 'B Grade' },
    { name: 'shirtFabric', type: 'text', label: 'Shirt Fabric' },
    { name: 'dupptaFabric', type: 'text', label: 'Duppta Fabric' },
    { name: 'embName', type: 'text', label: 'Emb Name' },
    { name: 'baseParty', type: 'text', label: 'Base Party' },
    { name: 'dayingName', type: 'text', label: 'Daying Name' },
    { name: 'varient', type: 'text', label: 'Varient' }
  ]
};