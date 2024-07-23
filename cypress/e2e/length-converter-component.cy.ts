describe('Length Converter Component', () => {
    beforeEach(() => {
      cy.visit('/length-converter');
    });
  
    it('should load the length converter form', () => {
      cy.get('[data-cy="fromLength"]').should('exist');
      cy.get('[data-cy="toLength"]').should('exist');
      cy.get('[data-cy="fromAmount"]').should('exist');
      cy.get('[data-cy="toAmount"]').should('exist');
      cy.get('.swap-button').should('exist');
      cy.get('.reset-button').should('exist');

    });
  
    it('should convert kilometers to meters correctly', () => {
      // Fill the form
      cy.get('[data-cy="fromAmount"]').clear({ force: true }).type('1', { force: true });
      cy.get('mat-select[data-cy="fromLength"]').click({ force: true });
      cy.get('mat-option').contains('Kilometer').click({ force: true });
      cy.get('mat-select[data-cy="toLength"]').click({ force: true });
      cy.get('mat-option').contains('Meter').click({ force: true });
      cy.wait(1000)
      // Verify the result
      cy.get('[data-cy="toAmount"]').should('have.value', '1000');
    });
  
  
    it('should reset form on reset button click', () => {
      // Fill the form
      cy.get('[data-cy="fromAmount"]').clear({ force: true }).type('1', { force: true });
      cy.get('mat-select[data-cy="fromLength"]').click({ force: true });
      cy.get('mat-option').contains('Kilometer').click({ force: true });
      cy.get('mat-select[data-cy="toLength"]').click({ force: true });
      cy.get('mat-option').contains('Meter').click({ force: true });
      cy.get('.reset-button').click();
      cy.wait(1000)
      // Verify the result
      cy.get('[data-cy="toAmount"]').should('have.value', '');
      cy.get('[data-cy="fromAmount"]').should('have.value', ''); 
      cy.get('[data-cy="fromLength"]').should('have.value', '');
      cy.get('[data-cy="toLength"]').should('have.value', '');
      
    });

    
    it('should swap lengths on swap button click', () => {
        // Fill the form
        cy.get('mat-select[data-cy="fromLength"]').click({ force: true });
        cy.get('mat-option').contains('Mile').click({ force: true });
        cy.get('mat-select[data-cy="toLength"]').click({ force: true });
        cy.get('mat-option').contains('Yard').click({ force: true });
        cy.get('.swap-button').click();
        cy.wait(1000)
        // Verify the result
        cy.get('mat-select[data-cy="fromLength"]').contains('Yard');
        cy.get('mat-select[data-cy="toLength"]').contains('Mile');
      });
    
  
  }
  )