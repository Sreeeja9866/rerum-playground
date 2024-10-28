// This is the catalog of tools that will be used in the playground.
// Each tool contains a label, icon, description, and a view (URL) for redirection.

const ToolsCatalog = [
    {
        label: "TinyNode",
        icon: "./images/rerum_logo.png",
        view: "https://tiny.rerum.io/",
        description: "A flexible tool for interacting with objects from RERUM, allowing users to experiment with data."
    },
    {
        label: "Geolocating Web Annotation Tool",
        icon: "./images/rerum_logo.png",
        view: "https://geo.rerum.io/",
        description: "Helps users annotate data with geolocation coordinates by selecting points on a map."
    },
    {
        label: "navPlace Object Tool",
        icon: "./images/rerum_logo.png",
        view: "https://geo.rerum.io/",
        description: "Allows interaction with place-based objects in a spatial context."
    },
    {
        label: "TPEN",
        icon: "./images/T-PEN_logo.png",
        view: "https://t-pen.org/TPEN/",
        description: "Allows users to transcribe manuscripts by aligning text with scanned images for research and accuracy."
    },
    {
        label: "Adno",
        icon: "./images/adno-logo.png",
        view: "https://w.adno.app/",
        description: "A tool for viewing and editing IIIF and static images within archives and heritage collections."
    },
    {
        label: "Universal Viewer",
        icon: "./images/uv-logo.png",
        view: "https://universalviewer.io/",
        description: "A viewer for web objects, allowing users to share their media with the world."
    }
];

// export the tools catalog to be used in config.js
export default ToolsCatalog;

import { storeManifestLink } from './js/playground.js';

            document.addEventListener('DOMContentLoaded', function() {
                const manifestUrl = document.getElementById('manifestUrl');
                const loadManifest = document.getElementById('loadManifest');
                const manifestMessage = document.getElementById('manifestMessage');
                const loadMessage = document.getElementById("loadMessage");
                const manifestLabelField = document.getElementById("manifestLabelField");

                loadManifest.addEventListener('click', function() {
                    const url = manifestUrl.value.trim();
                    if (!url) {
                        manifestMessage.textContent = 'Please enter a URL.';
                        manifestMessage.style.color = 'red';
                        return;
                    }

                    manifestMessage.textContent = 'Loading...';
                    manifestMessage.style.color = 'black';

                    fetch(url)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            // process JSON URL data
                            manifestMessage.textContent = 'Manifest loaded successfully!';
                            manifestMessage.style.color = 'green';

                            storeManifestLink(url);
                            
                            //console.log(data); only logging the manifest for now. this can be changed to open a specific tool to use or however we want to handle the newly loaded manifest.
                            
                            //If manifest has the fields to be displayed, load text at the top of the page.
                            const loadedManifest = data;

                            //Attempts to load specific fields from manifest. If any do not exist, displays error message. (Need to fix this to work a different way.)
                            try{
                                let manifestLabel = JSON.stringify(loadedManifest.label.en[0]);
                                manifestLabel = "Name: " + manifestLabel.replaceAll("\"","");

                                let manifestType = JSON.stringify(loadedManifest.type);
                                manifestType = "Type: " + manifestType.replaceAll("\"","");

                                let manifestItemCount = "Number of Items: " + loadedManifest.items.length;

                                loadMessage.innerHTML = "<u>Current Object:</u>";
                                //This should also be replaced with separate columns, in case there may be longer fields to display.
                                manifestLabelField.innerHTML = manifestLabel + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + manifestType + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + manifestItemCount;
                            }
                            catch{
                                loadMessage.innerHTML = "No metadata available!";
                                manifestLabelField.innerHTML = "";
                            }
                        })
                        .catch(error => {
                            manifestMessage.textContent = 'Failed to load manifest. Please check the URL and try again.';
                            manifestMessage.style.color = 'red';
                            console.error('Error:', error);
                        });
                });
            });

            //Toggles recent manifest links dropdown menu
            function toggleDropdown() {
                const manifestContainer = document.getElementById('stored_manifest_links');
                const dropdownArrow = document.getElementById('dropdownArrow');

                if (manifestContainer.style.display === 'none' || manifestContainer.style.display === '') {
                    manifestContainer.style.display = 'block';  // Show content
                    dropdownArrow.textContent = '▲';  // Change arrow to up
                } else {
                    manifestContainer.style.display = 'none';   // Hide content
                    dropdownArrow.textContent = '▼';  // Change arrow to down
                }
            }

            // Add click event to both label and arrow to toggle the dropdown
            document.getElementById('dropdownLabel').addEventListener('click', toggleDropdown);
            document.getElementById('dropdownArrow').addEventListener('click', toggleDropdown);

            //Renders stored manifests
            function renderStoredManifests() {
                const manifestContainer = document.getElementById('stored_manifest_links');
                const storedManifests = getStoredManifestLinks();

                if (!manifestContainer) {
                    console.error("Manifest container not found.");
                    return;
                }

                manifestContainer.innerHTML = '';  // Clear previous content

                if (storedManifests.length === 0) {
                    manifestContainer.innerHTML = '<p>No stored manifest links.</p>';
                    return;
                }

                storedManifests.forEach(manifestLink => {
                    const manifestHTML = `
                        <a href="${manifestLink}" target="_blank" class="manifestLink">
                            <p>${manifestLink}</p>
                        </a>
                    `;
                    manifestContainer.innerHTML += manifestHTML;
                });
            }