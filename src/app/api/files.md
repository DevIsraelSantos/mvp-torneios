├── api
│ ├── auth
│ │ └── […nextauth]
│ │ └── route.ts # Next Auth handlers
│ │
│ ├── users
│ │ ├── route.ts # GET /api/users (Listar)
│ │ └── [id]
│ │ └── route.ts # GET, POST, PATCH (Buscar, Novo, Atualizar)
│ │
│ ├── missions
│ │ ├── route.ts # GET , POST (Listar, Criar)
│ │ └── [id]
│ │ └── route.ts # GET , PATCH, DELETE (Buscar, Editar e Inativar)
│ │
│ ├── rewards
│ │ ├── route.ts # GET, POST (Listar, Criar)
│ │ └── [id]
│ │ └── route.ts # GET, PATCH, DELETE /api/rewards/:id (Buscar, Editar/Inativar)
│ │
│ ├── achievements
│ │ ├── route.ts # GET, POST (Listar e conquistar)
│ │ └── [id]
│ │ ├── approve
│ │ │ └── route.ts # PATCH (Aprova)
│ │ └── reject
│ │ └── route.ts # PATCH (Rejeita)
│ │
│ ├── redemptions
│ │ ├── route.ts # GET, POST (Lista e Resgata)
│ │ └── [id]
│ │ ├── approve
│ │ │ └── route.ts # PATCH (Aprova)
│ │ └── reject
│ │ └── route.ts # PATCH (Rejeita)
│ │
│ ├── reports
│ │ ├── engagement
│ │ │ └── route.ts # GET /api/reports/engagement
│ │ └── rewards
│ │ └── route.ts # GET /api/reports/rewards
│ │
│ └── admin
│ └── dashboard
│ └── route.ts # GET /api/admin/dashboard
│
└── dtos # Data Transfer Objects (DTOs)
