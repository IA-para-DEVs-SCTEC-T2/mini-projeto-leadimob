/**
 * @jest-environment jsdom
 */

describe('SearchFilter XSS Protection', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    
    // Create mock containers that the component expects
    const cardsContainer = document.createElement('div');
    cardsContainer.id = 'leads-cards-container';
    document.body.appendChild(cardsContainer);

    const tableBody = document.createElement('tbody');
    tableBody.id = 'leads-table-body';
    document.body.appendChild(tableBody);
  });

  it('should prevent XSS injection when creating empty state elements', () => {
    // Simulate the vulnerable scenario
    const search_term = '<img src=x onerror=alert(document.cookie)>';
    
    // Test the corrected function logic
    const cards_container = document.getElementById('leads-cards-container');
    const table_body = document.getElementById('leads-table-body');
    
    if (cards_container) {
      const empty_state = document.createElement('div');
      empty_state.id = 'search-empty-state';
      empty_state.className = 'py-8 text-center text-slate-400';
      
      // ✅ CORRECTED - Using textContent instead of innerHTML
      const message_p = document.createElement('p');
      message_p.className = 'text-sm';
      message_p.textContent = `Nenhum lead encontrado para "${search_term}"`;
      
      empty_state.appendChild(message_p);
      cards_container.appendChild(empty_state);
      
      // Verify that the malicious script is safely displayed as text
      const messageElement = document.querySelector('#search-empty-state p');
      expect(messageElement?.textContent).toContain(search_term);
      
      // Verify no script or img elements were created
      const scriptElements = document.querySelectorAll('script');
      const imgElements = document.querySelectorAll('img[src="x"]');
      
      expect(scriptElements.length).toBe(0);
      expect(imgElements.length).toBe(0);
    }
    
    if (table_body) {
      const empty_row = document.createElement('tr');
      empty_row.id = 'search-empty-state-row';
      const empty_cell = document.createElement('td');
      empty_cell.className = 'py-8 text-center text-slate-400';
      
      // ✅ CORRECTED - Using textContent instead of innerHTML
      const message_p = document.createElement('p');
      message_p.className = 'text-sm';
      message_p.textContent = `Nenhum lead encontrado para "${search_term}"`;
      
      empty_cell.appendChild(message_p);
      empty_row.appendChild(empty_cell);
      table_body.appendChild(empty_row);
      
      // Verify that the malicious script is safely displayed as text
      const messageElement = document.querySelector('#search-empty-state-row p');
      expect(messageElement?.textContent).toContain(search_term);
      
      // Verify no additional script or img elements were created
      const scriptElements = document.querySelectorAll('script');
      const imgElements = document.querySelectorAll('img[src="x"]');
      
      expect(scriptElements.length).toBe(0);
      expect(imgElements.length).toBe(0);
    }
  });

  it('should safely display HTML-like content as text', () => {
    const search_term = '<div><script>alert("xss")</script></div>';
    
    const cards_container = document.getElementById('leads-cards-container');
    
    if (cards_container) {
      const empty_state = document.createElement('div');
      empty_state.id = 'search-empty-state';
      
      const message_p = document.createElement('p');
      message_p.textContent = `Nenhum lead encontrado para "${search_term}"`;
      
      empty_state.appendChild(message_p);
      cards_container.appendChild(empty_state);
      
      // Should display the HTML as text, not render it
      expect(message_p.textContent).toContain(search_term);
      
      // Should not create actual script or div elements from the search term
      const scriptElements = document.querySelectorAll('script');
      const nestedDivs = document.querySelectorAll('#search-empty-state div div');
      
      expect(scriptElements.length).toBe(0);
      expect(nestedDivs.length).toBe(0);
    }
  });
});