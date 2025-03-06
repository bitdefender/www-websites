// form
const initializeHubspotModule = () => {
  // Helper to load the HubSpot forms script if it isn't already loaded
  const loadHubspotScript = (callback) => {
    if (typeof hbspt !== "undefined") {
      callback();
      return;
    }
    const script = document.createElement('script');
    script.charset = "utf-8";
    script.type = "text/javascript";
    script.src = "//js.hsforms.net/forms/embed/v2.js";
    script.onload = callback;
    document.head.appendChild(script);
  };

  // Helper to extract form event data
  const getFormEventData = (hubspotForm) => {
    const portalId = hubspotForm.querySelector('.portal-id').value;
    const dl_formTitle = hubspotForm.querySelector('.dl-form-title').value;
    const dl_formID = hubspotForm.querySelector('.dl-form-ID').value;
    const dl_formProduct = hubspotForm.querySelector('.dl-form-product').value === 'true' && portalId;
    const formProfile = Object.fromEntries(
      [
        ['form', dl_formTitle],
        ['formProduct', dl_formProduct],
        ['formID', dl_formID]
      ].filter(([, value]) => value)
    );
    return formProfile;
  };

  // Helper to update Adobe Data Layer and redirect when needed
  const updateDataLayerAndRedirect = async (hubspotForm, mainPopupButton) => {
    if (mainPopupButton) {
      const newPageLoadStartedEvent = await new PageLoadStartedEvent();
      newPageLoadStartedEvent.page.info.name += ':consultation booked';
      newPageLoadStartedEvent.page.info.subSubSubSection = 'consultation booked';
      AdobeDataLayerService.push(newPageLoadStartedEvent);
    }

    AdobeDataLayerService.push(
      new FormEvent('form completed', getFormEventData(hubspotForm))
    );

    if (mainPopupButton) {
      AdobeDataLayerService.push(new PageLoadedEvent());
    }

    const thankYouUrl = hubspotForm.querySelector('.redirect-url').value;
    if (thankYouUrl) {
      window.location.href = thankYouUrl;
    }
  };

  // Helper to initialize the HubSpot form
  const initHubspotForm = (portalId, formId, hubspotForm, mainPopupButton, index) => {
    const sfdcCampaignId = hubspotForm.querySelector('.sfdc-campaign-id').value;
    const region = hubspotForm.querySelector('.region').value;

    hbspt.forms.create({
      region: region,
      portalId: portalId,
      formId: formId,
      sfdcCampaignId: sfdcCampaignId,
      target: `.hubspot-form-${index}`,
      onFormSubmit: () => updateDataLayerAndRedirect(hubspotForm, mainPopupButton)
    });
  };

  // Helper to initialize popup events if applicable
  const initialiseHubspotFormPopupEvents = (hubspotForm, mainPopupButton) => {
    if (!mainPopupButton) return;
    mainPopupButton.addEventListener('click', async () => {
      const newPageLoadStartedEvent = await new PageLoadStartedEvent();
      newPageLoadStartedEvent.page.info.name += ':book consultation';
      newPageLoadStartedEvent.page.info.subSubSubSection = 'book consultation';
      AdobeDataLayerService.push(newPageLoadStartedEvent);
      AdobeDataLayerService.push(
        new FormEvent('form viewed', getFormEventData(hubspotForm))
      );
      AdobeDataLayerService.push(new PageLoadedEvent());
    });
  };

  // Create the container with the HubSpot form markup
  const hubspotContainer = document.createElement('div');
  hubspotContainer.innerHTML = `
    <section class="download-popup download-popup__container download-popup--animate">
      <div class="download-popup__modal download-complex !tw-overflow-auto !tw-max-w-[90%] md:!tw-max-w-[75%] lg:!tw-max-w-[60%] xl:!tw-max-w-[45%] tw-max-h-[90%]">
        <div class="xfpage page basicpage">
          <div id="container-3cd9406401" class="cmp-container">
            <div class="hubspot-form">
              <section class="hubspot-form-container tw-pt-0 tw-pb-0">
                <input type="hidden" class="region" value="na1">
                <input type="hidden" class="portal-id" value="341979">
                <input type="hidden" class="form-id" value="addb61d4-4858-4349-a3ec-cddc790c4a2c">
                <input type="hidden" class="sfdc-campaign-id" value="7016M0000027VMQQA2">
                <input type="hidden" class="redirect-url">
                <input type="hidden" class="dl-form-title">
                <input type="hidden" class="dl-form-ID">
                <input type="hidden" class="dl-form-product" value="false">
                <div class="form-for-hubspot hubspot-form-0" data-hs-forms-root="true"></div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
  document.body.appendChild(hubspotContainer);

  // Wait for the HubSpot script to load before initializing forms
  loadHubspotScript(() => {
    // Initialize each HubSpot form on the page
    const hubspotForms = hubspotContainer.querySelectorAll('.hubspot-form-container');
    hubspotForms.forEach((hubspotForm, index) => {
      const portalId = hubspotForm.querySelector('.portal-id').value;
      const formId = hubspotForm.querySelector('.form-id').value;

      if (portalId && formId) {
        const downloadPopup = hubspotForm.closest('section.download-popup');
        const mainPopupButton = downloadPopup?.parentElement?.querySelector('button.download-main-button');
        const formContainer = hubspotForm.querySelector('.form-for-hubspot');
        formContainer.classList.add(`hubspot-form-${index}`);

        initHubspotForm(portalId, formId, hubspotForm, mainPopupButton, index);
        initialiseHubspotFormPopupEvents(hubspotForm, mainPopupButton);
      }
    });
  });

  // Ensure hubspotContainer is defined
  const popupContainer = hubspotContainer.querySelector(".download-popup__container");
  document.querySelectorAll(
    ".subscriber #heroColumn table tr td:nth-of-type(1), .subscriber .columnvideo2 > div.image-columns-wrapper table tr td:first-of-type"
  ).forEach(trigger => {
    trigger.addEventListener("click", e => popupContainer.style.display = "block");
  });

  popupContainer?.addEventListener("click", e => popupContainer.style.display = "none");
}

window.addEventListener('load', () => {
  initializeHubspotModule();
});
