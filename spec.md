# StudyLocker - Document Management Application

## Overview
StudyLocker is a secure document storage and management application for students to store, view, and manage their academic and personal documents. The application provides a DigiLocker-like experience with secure blob storage and Internet Identity authentication.

## Authentication
- Students authenticate using Internet Identity
- Only authenticated users can access the document management features

## Core Features

### Document Upload
- Students can upload multiple document types including:
  - Marksheets and academic certificates
  - ID cards and identity documents
  - PDF files
  - Image files (JPG, PNG, etc.)
- Files are stored using blob storage for security and scalability
- Each document is associated with the authenticated user

### Document Management
- View list of all uploaded documents in "My Documents" dashboard
- Preview documents directly in the browser
- Download documents to local device
- Delete documents permanently
- Documents are organized chronologically by upload date

### User Interface
- Mobile-friendly responsive design
- Intuitive navigation with clear document categories
- All content and interface elements in Hindi language
- Clean dashboard layout showing document thumbnails and metadata

## Backend Data Storage
- User document metadata (filename, upload date, file type, file size)
- Document files stored in blob storage
- User-document associations linked to Internet Identity principals
- Document access permissions ensuring users only see their own files

## Backend Operations
- Authenticate users via Internet Identity
- Handle file uploads to blob storage
- Retrieve user's document list
- Serve document files for preview/download
- Delete documents and associated metadata
- Manage user permissions and data isolation
