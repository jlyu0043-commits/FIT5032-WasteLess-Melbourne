export const recyclingLocations = [
  {
    id: 1,
    name: 'Clayton Recycling Centre',
    icon: '🏢',
    address: '123 Example Road, Clayton VIC 3168',
    suburb: 'Clayton',
    postcode: '3168',
    distance: '1.2 km away',
    accepts: [
      'Batteries',
      'E-waste',
      'Small electronics',
    ],
    acceptedItems: [
      {
        name: 'Batteries',
        icon: '🔋',
      },
      {
        name: 'E-waste',
        icon: '🖥️',
      },
      {
        name: 'Small electronics',
        icon: '📱',
      },
    ],
  },
  {
    id: 2,
    name: 'Oakleigh Collection Point',
    icon: '♻️',
    address: '45 Station Street, Oakleigh VIC 3166',
    suburb: 'Oakleigh',
    postcode: '3166',
    distance: '2.8 km away',
    accepts: [
      'Batteries',
    ],
    acceptedItems: [
      {
        name: 'Batteries',
        icon: '🔋',
      },
    ],
  },
]
