// Explicity list cookies by name that are important
// and should not be made available for deletion.
const cookieExclude = ["_ga_M2G57WEW9J", "_gid"];

// List cookies that should be auto-checked for deletion. These 
// are matched with a "startsWith" comparison, making
// it easy to bulk identify cookies.
// The 'cookieExclude' comparison takes precedence.
const autoCookieInclude = ["_g", "AMCV"];

// Wait until page has loaded to call DOM manipulations.
document.addEventListener('DOMContentLoaded', () => {
    const cIndex = createCookieIndex();
    updateCookieList(cIndex);
    selectAllUpdate();
})

// createCookieIndex splits the accessible cookies to an array.
// Returns an array.
function createCookieIndex() {
    let cookieIndex = [];
    document.cookie.split(';').forEach(function (cookie) {
        cookieIndex.push(cookie);
    })
    return cookieIndex;
}

// updateCookieList takes an array of cookies that can be read
// and adds rows to a target table for manipulation.
function updateCookieList(cookieIndex) {
    const cookieTable = document.getElementById('cookie-table');
    cookieIndex.forEach(function (cookie) {
        const cookieData = cookie.split("=")
        const cookieName = cookieData[0].trim();
        const exclude = excludeCookie(cookieName);
        const autoInclude = autoIncludeCookie(cookieName);

        let row = cookieTable.insertRow();
        row.setAttribute('id', cookieName);
        if (exclude) {
            row.insertCell(0).innerHTML = '<input type="checkbox" name="'+cookieName+'" disabled />';
        } else if (autoInclude) {
            row.insertCell(0).innerHTML = '<input type="checkbox" class="cookie-row" name="'+cookieName+'" checked />';
        } else {
            row.insertCell(0).innerHTML = '<input type="checkbox" class="cookie-row" name="'+cookieName+'" />';
        }
        row.insertCell(1).innerHTML = cookieName;
        row.insertCell(2).innerHTML = cookieData[1];
    })
}

// excludeCookie takes a cookie name to see if it is
// in the array of cookies names to exclude.
// Returns a boolean.
function excludeCookie(cookieName) {
    if (cookieExclude.length != 0) {
        for (let i = 0; i < cookieExclude.length; i++) {
            if (cookieExclude[i] === cookieName) {
                return true
            }
        }
        return false;
    }
    return false;
}

// autoIncludeCookie takes a cookie name and does a startsWith comparison
// on the array of cookies to automatically check/include.
// Returns a boolean.
function autoIncludeCookie(cookieName) {
    if (autoCookieInclude.length != 0) {
        for (let i = 0; i < autoCookieInclude.length; i++) {
            if (cookieName.startsWith(autoCookieInclude[i])) {
                return true;
            }
        }
        return false;
    }
    return false;
}

// selectAllUpdate attaches an event handler to enable
// the bulk selection of cookies to delete.
function selectAllUpdate() {
    const selectAllCheckbox = document.getElementById("select-all");
    const enabledCheckboxes = document.querySelectorAll('input.cookie-row');
    selectAllCheckbox.addEventListener("click", (e) => {
        if (selectAllCheckbox.checked) {
            enabledCheckboxes.forEach((cRow) => {
                cRow.checked = true;
            })
        } else {
            enabledCheckboxes.forEach((cRow) => {
                cRow.checked = false;
            })
        }
    })
}

// removeCookies identifies the 'checked' input boxes and
// sets the expiration time in the past so that the
// cookie is removed.
function removeCookies() {
    const checkBoxes = document.querySelectorAll('input.cookie-row');
    // Create an expiraton time.
    const timeExpire = new Date(Date.now() - 1000);
    // Split the hostname, reverse the array order, assemble the second level domain for the cookie.
    const domainPartsReversed = location.hostname.split('.').reverse();
    const cookieDomain = "."+domainPartsReversed[1]+"."+domainPartsReversed[0];

    checkBoxes.forEach((cb) => {
        if (cb.checked) {
            const cookieName = cb.getAttribute("name")
            document.cookie = cookieName+"=delete; expires="+timeExpire.toUTCString()+"; path=/; domain="+cookieDomain
            // Remove the deleted cookie row from the table.
            removeRow(cookieName);
        }
    })

    const selectAllCheckbox = document.getElementById('select-all')
    selectAllCheckbox.checked = false;
}

// removeRow removes the table row that represented a
// cookie that was deleted.
function removeRow(id) {
    const row = document.getElementById(id);
    row.remove();
}