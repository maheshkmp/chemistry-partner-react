// ... existing code ...
{ papers.map(paper => (
  <div key={paper.id} className="paper-item">
    <h3>{paper.title}</h3>
    <p>{paper.description}</p>
    <Button 
      variant="contained" 
      color="primary"
      onClick={() => handlePurchase(paper.id)}
    >
      Purchase (${paper.price})
    </Button>
  </div>
))}
// ... existing code ...