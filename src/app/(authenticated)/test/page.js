export default function TestPage() {
  return (
    <div style={{
      margin: '100px auto',
      maxWidth: '800px',
      background: 'white',
      padding: '20px',
      borderRadius: '10px',
      color: 'black'
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
        Test Page
      </h1>
      <p>
        This is a simple test page with NO client components or authentication.
      </p>
      <p style={{ marginTop: '20px', color: 'red' }}>
        If you can see this text, basic page rendering is working.
      </p>
    </div>
  )
}