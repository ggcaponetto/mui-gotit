// E2E coverage for the Vite demo at ../demo, which aliases `mui-gotit`
// to ../src so these tests exercise the actual library source.

const SNACKBAR = '.MuiSnackbar-root';

describe('mui-gotit demo', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('renders the page', () => {
    cy.contains('h3', 'mui-gotit').should('be.visible');
    cy.get(SNACKBAR).should('not.exist');
  });

  it('opens a snackbar on click and auto-hides after autoHideDuration', () => {
    cy.contains('button', /^success$/i).click();
    cy.get(SNACKBAR).should('have.length', 1);
    // autoHideDuration = 4000ms in the demo
    cy.get(SNACKBAR, { timeout: 6000 }).should('not.exist');
  });

  it('caps the stack at maxSnackbars (main group: 4)', () => {
    for (let i = 0; i < 6; i += 1) {
      cy.contains('button', /^info$/i).click();
    }
    cy.get(SNACKBAR).should('have.length', 4);
  });

  it('clears a group on demand', () => {
    cy.contains('button', /^warning$/i).click();
    cy.contains('button', /^warning$/i).click();
    cy.get(SNACKBAR).should('have.length', 2);
    cy.contains('button', /^clear group$/i).click();
    cy.get(SNACKBAR).should('not.exist');
  });

  it('keeps independent groups independent', () => {
    cy.contains('button', /^top-left$/i).click();
    cy.contains('button', /^bottom-right$/i).click();
    cy.get(SNACKBAR).should('have.length', 2);
    // The two snackbars are anchored to opposite corners — assert their
    // computed positions actually differ on the y-axis.
    cy.get(SNACKBAR).then(($els) => {
      const tops = [...$els].map((el) => el.getBoundingClientRect().top);
      expect(new Set(tops).size).to.be.greaterThan(1);
    });
  });

  it('fade group caps at maxSnackbars: 3', () => {
    for (let i = 0; i < 5; i += 1) {
      cy.contains('button', /spawn \(fade=true\)/i).click();
    }
    cy.get(SNACKBAR).should('have.length', 3);
    cy.contains('button', /^clear$/i).click();
    cy.get(SNACKBAR).should('not.exist');
  });
});
