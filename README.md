# React AI Chat Application

while true; do echo "$(date '+%Y-%m-%d %H:%M:%S') - $(nvidia-smi --query-gpu=temperature.gpu --format=csv,noheader)°C" | tee -a cpu_temp.log; sleep 5; done

$ opencode chat --model qwen-local/qwen-coder

npm install -g opencode-ai@latest

A modern React chat application built with Vite that demonstrates AI-powered conversation capabilities using the Qwen model.

## Features

- Real-time chat interface with message history
- AI-powered responses using Qwen language model
- Responsive design for all device sizes
- Built with React and Vite for fast development
- Clean, modern UI with intuitive user experience

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
```

2. Install dependencies:
```bash
npm install
```

### Development

To start the development server:
```bash
npm run dev
```

This will start the server and open the application in your browser at `http://localhost:5173`.

### Building for Production

To build the application for production:
```bash
npm run build
```

The built files will be generated in the `dist` directory.

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components
├── services/       # API and AI service integrations
├── utils/          # Utility functions
├── App.jsx         # Main application component
└── main.jsx        # Entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking (if applicable)

## AI Integration

This application uses the Qwen model for generating responses. The integration is configured to use:
- Model: qwen-local/qwen-coder
- Endpoint: [Your API endpoint here]

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.