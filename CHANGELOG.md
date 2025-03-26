# Changelog

## [0.1.1] - 2025-03-24

### Fixed
- Fixed Tailwind CSS configuration by updating directives in globals.css 
- Fixed font configuration in layout.js
- Fixed deprecated `globalThis` usage in prisma.js client
- Fixed Next.js issues with the auth implementation
- Fixed duplicate auth configuration by consolidating into a single source

### Added
- Jest testing setup with react-testing-library
- Basic tests for NextAuth configuration
- Basic tests for MainNav component
- Added proper ESLint configuration
- Added Jest configuration with proper ESM module handling

### Changed
- Improved error handling in NextAuth implementation by removing console logs
- Organized CSS by proper layer directives (base, components, utilities)
- Updated package.json with correct dependencies and versions
- Enhanced README with project documentation

### Security
- Removed sensitive debug logs from auth implementation
- Improved error handling for environment variable validation