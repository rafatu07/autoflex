describe('Smoke E2E', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('loads the app and shows navigation', () => {
    cy.contains('Estoque Autoflex')
    cy.contains('Produtos').click()
    cy.url().should('include', '/products')
    cy.contains('Matérias-primas').click()
    cy.url().should('include', '/raw-materials')
    cy.contains('Sugestão de produção').click()
    cy.url().should('include', '/production-suggestion')
  })

  it('Products page shows list and New Product button', () => {
    cy.visit('/products')
    cy.contains('Produtos')
    cy.contains('Novo produto')
  })

  it('Raw Materials page shows list and New Raw Material button', () => {
    cy.visit('/raw-materials')
    cy.contains('Matérias-primas')
    cy.contains('Nova matéria-prima')
  })

  it('Production Suggestion page loads', () => {
    cy.visit('/production-suggestion')
    cy.contains('Sugestão de produção')
  })
})
