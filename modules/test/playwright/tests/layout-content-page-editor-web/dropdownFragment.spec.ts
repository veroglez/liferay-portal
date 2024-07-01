/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {apiHelpersTest} from '../../fixtures/apiHelpersTest';
import {isolatedSiteTest} from '../../fixtures/isolatedSiteTest';
import {loginTest} from '../../fixtures/loginTest';
import {pageEditorPagesTest} from '../../fixtures/pageEditorPagesTest';
import getRandomString from '../../utils/getRandomString';
import getFragmentDefinition from './utils/getFragmentDefinition';
import getPageDefinition from './utils/getPageDefinition';
import {featureFlagsTest} from "../../fixtures/featureFlagsTest";

const test = mergeTests(
	apiHelpersTest,
	featureFlagsTest({
		'LPS-178052': true,
	}),
	isolatedSiteTest,
	loginTest(),
	pageEditorPagesTest
);

test('check dropdown drop zone container is always displayed correctly', async ({
	apiHelpers,
	page,
	pageEditorPage,
	site,
}) => {
	const dropdownId = getRandomString();

	const dropdownFragment = getFragmentDefinition({
		id: dropdownId,
		key: 'BASIC_COMPONENT-dropdown',
	});

	const layout = await apiHelpers.headlessDelivery.createSitePage({
		pageDefinition: getPageDefinition([dropdownFragment]),
		siteId: site.id,
		title: getRandomString(),
	});

	await pageEditorPage.goto(layout, site.friendlyUrlPath);

	const dropdownFragmentLocator = await page.locator('.dropdown-fragment');

	const dropdownButton = await dropdownFragmentLocator.locator('.dropdown-fragment-toggle');

	await expect(dropdownButton.getByText('Dropdown', { exact: true })).toBeVisible();

	await pageEditorPage.selectFragment(dropdownId);

	await dropdownButton.click();

	await page.waitForSelector('.dropdown-fragment-toggle[aria-expended="true"]');

	await expect(dropdownButton.getAttribute('aria-expanded')).toBe('true');

	const dropdownMenu = await dropdownFragmentLocator.locator('.dropdown-fragment-menu');

	await dropdownMenu.waitFor();

	await expect(dropdownMenu).toBeVisible();

	await dropdownMenu.getByText('Place fragments or widgets here.').waitFor();
});
