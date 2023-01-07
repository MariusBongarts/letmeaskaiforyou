// @ts-check

/**
 * CONSTANTS
 */
const SEARCH_FORM_ID = "search-form";
const SEARCH_FORM_INPUT_ID = "search-form-input";
const SEARCH_TYPE_KEY = "searchType";
const SEARCH_TYPE_CHATBOT = "chat";
const COPY_LINK_CONTAINER_ID = "copy-url-container";
const COPY_URL_BTN = "copy-url-btn";
const COPY_LINK_TEXT_ID = "copy-url-text";
const SEARCH_ENGINE_YOU_ID = "you.com";

/**
 * DOM ELEMENTS
 */
const searchForm = document.getElementById(SEARCH_FORM_ID);
const searchInput = document?.getElementById(SEARCH_FORM_INPUT_ID);
const queryParam = decodeURIComponent(getQueryParam("q") ?? "");
const searchType = getQueryParam(SEARCH_TYPE_KEY);

/**
 * FUNCTIONS
 */
function getQueryParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

function encodeQueryParam(q) {
  return encodeURIComponent(q);
}

function startFakeTyping() {
  let typingIndex = 0;

  searchInput.value = "";

  const typingInterval = setInterval(() => {
    searchInput?.focus();
    searchInput.value += queryParam[typingIndex];
    typingIndex++;

    const typingIsFinished = typingIndex === queryParam.length;
    if (typingIsFinished) {
      clearInterval(typingInterval);
      setTimeout(() => {
        navigateToExternalLink();
      }, 1000);
    }
  }, 100);
}

function navigateToExternalLink() {
  const link = createExternalLink();
  location.href = link.replace("%2520", "+");
}

function createExternalLink(searchEngineUrl = SEARCH_ENGINE_YOU_ID) {
  switch (searchEngineUrl) {
    case SEARCH_ENGINE_YOU_ID: {
      const url = new URL(`https://you.com/search`);
      url.searchParams.append("q", decodeURIComponent(queryParam));
      if (searchType === SEARCH_TYPE_CHATBOT) {
        url.searchParams.append("tbm", "youchat");
      }
      return url.toString();
    }
    default:
      return "";
  }
}

function createInternalUrl(q, searchType = "") {
  const internalUrl = new URL(`http://localhost:3000`);
  internalUrl.searchParams.append("q", encodeQueryParam(q));
  if (searchType == SEARCH_TYPE_CHATBOT) {
    internalUrl.searchParams.append(SEARCH_TYPE_KEY, SEARCH_TYPE_CHATBOT);
  }
  return internalUrl.toString();
}

function createInternalUrlCopyElement(internalUrl) {
  const copyLinkTextElement = document.getElementById(COPY_LINK_TEXT_ID);
  if (copyLinkTextElement) {
    copyLinkTextElement.value = internalUrl;
  }
  const copyLinkContainer = document.getElementById(COPY_LINK_CONTAINER_ID);
  if (copyLinkContainer) {
    copyLinkContainer.style.display = "flex";
  }

  const copyUrlBtn = document.getElementById(COPY_URL_BTN);
  if (copyUrlBtn) {
    const fallback = () => {
      alert(`Copy to clipbaord failed. Copy the url manually ${internalUrl}`);
    };
    copyUrlBtn.onclick = () => {
      try {
        navigator.clipboard
          .writeText(internalUrl)
          .then(() => {
            alert(`Successfully copied URL. Share it with your friends!`);
          })
          .catch(() => {
            fallback();
          });
      } catch (error) {
        fallback();
      }
    };
  }
}
function createIframe(internalUrl) {
  const resultIframe =
    document.querySelector("iframe") || document.createElement("iframe");
  resultIframe.src = internalUrl;
  document.body.append(resultIframe);
}

function handleFormInput() {
  searchForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    const q = searchInput?.value ?? SEARCH_TYPE_CHATBOT;
    const searchType = event.submitter?.getAttribute(SEARCH_TYPE_KEY) ?? "";

    if (q) {
      const internalUrl = createInternalUrl(q, searchType);
      createInternalUrlCopyElement(internalUrl);
      // createIframe(internalUrl);
    }
  });
}

/*
 * VALIDATION
 */

if (!searchInput) {
  throw Error(`Search Form with id '${SEARCH_FORM_ID}' not found.`);
}

/*
 * MAIN PROGRAM
 */

if (queryParam) {
  startFakeTyping();
} else {
  handleFormInput();
}
