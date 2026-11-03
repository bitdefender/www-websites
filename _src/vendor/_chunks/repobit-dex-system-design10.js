import{c as e,l as t}from"./lit.js";import{n}from"./repobit-dex-system-design3.js";var r=e`
  .bd-ensemble {
    box-sizing: border-box;
    width: 100%;
    max-width: var(--bd-ensemble-max-width, var(--grid-container-max-xs));
    margin-inline: auto;
    padding-inline: var(--bd-ensemble-inline-padding, var(--grid-padding-xs));
  }

  /* a column inside this column is not a column */
  .bd-ensemble > * {
    --bd-ensemble-max-width: none;
    --bd-ensemble-inline-padding: 0;
  }

  @media ${t(n(`sm`))} {
    .bd-ensemble {
      max-width: var(--bd-ensemble-max-width, var(--grid-container-max-sm));
      padding-inline: var(--bd-ensemble-inline-padding, var(--grid-padding-sm));
    }
  }

  @media ${t(n(`md`))} {
    .bd-ensemble {
      max-width: var(--bd-ensemble-max-width, var(--grid-container-max-md));
      padding-inline: var(--bd-ensemble-inline-padding, var(--grid-padding-md));
    }
  }

  @media ${t(n(`lg`))} {
    .bd-ensemble {
      max-width: var(--bd-ensemble-max-width, var(--grid-container-max-lg));
      padding-inline: var(--bd-ensemble-inline-padding, var(--grid-padding-lg));
    }
  }

  @media ${t(n(`xl`))} {
    .bd-ensemble {
      max-width: var(--bd-ensemble-max-width, var(--grid-container-max-xl));
    }
  }

  @media ${t(n(`xxl`))} {
    .bd-ensemble {
      max-width: var(--bd-ensemble-max-width, var(--grid-container-max-xxl));
    }
  }

  @media ${t(n(`xxxl`))} {
    .bd-ensemble {
      max-width: var(--bd-ensemble-max-width, var(--grid-container-max-xxxl));
    }
  }
`;export{r as t};