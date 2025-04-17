# Pootie Tang Dictionary

![Pootie Tang Dictionary](https://raw.githubusercontent.com/user/pootie-tang-dictionary/main/public/logo.png)

## Overview

The Pootie Tang Dictionary is a web application that serves as a comprehensive translator for Pootie Tang's unique language as featured in the 2001 comedy film. This interactive platform allows users to search and translate between English and Pootie Tang phrases with an engaging, user-friendly interface.

## Features

### User-Facing Features

- **Bidirectional Search**: Search for translations in either English or Pootie Tang language
- **Interactive Card Layout**: Clear visualization of phrase pairs with contextual usage information
- **Pronunciation Guide**: Audio assistance for Pootie Tang phrases with:
  - Phonetic spelling guides
  - Text-to-speech functionality
  - Support for custom audio files
- **Responsive Design**: Seamless experience across mobile, tablet, and desktop devices
- **Loading Animation**: Engaging loading screens with authentic Pootie Tang catchphrases

### Administrative Features

- **Authentication System**: Secure login for administrative access
- **Dictionary Management**: Add, edit, and delete dictionary entries with a user-friendly interface
- **Content Management**: Control site title, description, and branding
- **Custom GIF Integration**: Add personality to the site with configurable GIFs
- **Loading Phrase Customization**: Edit the collection of phrases shown during loading states

## Technology Stack

### Frontend
- React with TypeScript
- TanStack Query for data fetching & caching
- Shadcn UI components
- Tailwind CSS for styling
- Zod for form validation
- Wouter for routing

### Backend
- Express.js server
- PostgreSQL database
- Drizzle ORM for database interactions
- Passport.js for authentication

## Getting Started

### Prerequisites

- Node.js (version 18+)
- PostgreSQL database

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/user/pootie-tang-dictionary.git
   cd pootie-tang-dictionary
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/pootie_tang_dict
   SESSION_SECRET=your_secure_session_secret
   ```

4. Initialize the database:
   ```
   npm run db:push
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open your browser to `http://localhost:5000`

### Default Admin Credentials

- **Username**: admin
- **Password**: admin123

*Note: For security, please change the default admin password after first login.*

## Usage Guide

### Searching the Dictionary

1. Navigate to the home page
2. Use the search bar to enter either English words or Pootie Tang phrases
3. View results displayed as interactive cards
4. Click on the pronunciation button (if available) to hear how phrases should be spoken

### Managing Dictionary Entries (Admin)

1. Log in using admin credentials
2. Navigate to the Dictionary Management tab
3. Use the search to filter existing entries
4. Click "New Entry" to add a phrase
5. Click edit/delete icons to modify or remove entries

### Configuring Site Settings (Admin)

1. Log in using admin credentials
2. Navigate to the Site Settings tab
3. Modify site title, description, and GIF URL
4. Customize loading phrases that appear during search operations
5. Click "Save Changes" to apply updates

## Project Structure

```
pootie-tang-dictionary/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── lib/             # Utility functions
│   │   ├── pages/           # Page components
│   │   └── context/         # React context providers
├── server/                  # Backend Express server
│   ├── routes.ts            # API route definitions
│   ├── storage.ts           # Storage interface
│   ├── db.ts                # Database connection
│   └── seed.ts              # Initial data seeding
├── shared/                  # Shared code between client and server
│   └── schema.ts            # Database schema definitions
└── README.md                # Project documentation
```

## Authentication Flow

The application uses a session-based authentication system:

1. Admin users provide credentials via the login form
2. Credentials are verified against hashed passwords in the database
3. On successful authentication, a session is created
4. Protected routes check for an active session
5. Logout invalidates and destroys the active session

## API Endpoints

### Authentication
- `POST /api/login` - Authenticate user
- `POST /api/logout` - End user session

### Dictionary Entries
- `GET /api/dictionary` - List all entries (accepts optional `q` query parameter for search)
- `GET /api/dictionary/:id` - Get a specific entry
- `POST /api/dictionary` - Create a new entry (admin only)
- `PUT /api/dictionary/:id` - Update an existing entry (admin only)
- `DELETE /api/dictionary/:id` - Delete an entry (admin only)

### Site Settings
- `GET /api/settings` - Get all site settings
- `GET /api/settings/:key` - Get a specific setting
- `POST /api/settings` - Update site settings (admin only)

## Pronunciation System

The pronunciation system uses a combination of:

1. **Phonetic Spelling**: Text-based pronunciation guides in a familiar format (e.g., "/sah-dah-tay/")
2. **Text-to-Speech**: Automated speech generation using the browser's Speech Synthesis API
3. **Custom Audio**: Support for custom recorded pronunciation files via URL

When a user clicks on a pronunciation button:
- If a custom audio URL exists, it plays that file
- If audio playback fails or no custom audio exists, it falls back to text-to-speech
- The system uses the phonetic spelling (without notation marks) for better pronunciation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Pootie Tang film and character created by Louis C.K.
- All Pootie Tang phrases and content are used for educational and entertainment purposes
- Special thanks to the React, TypeScript, and Shadcn UI communities

---

*"Sa da tay, my damies!" - Pootie Tang*