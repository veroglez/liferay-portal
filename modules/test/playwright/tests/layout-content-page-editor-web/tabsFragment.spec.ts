/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {expect, mergeTests} from '@playwright/test';

import {apiHelpersTest} from '../../fixtures/apiHelpersTest';
import {featureFlagsTest} from '../../fixtures/featureFlagsTest';
import {isolatedSiteTest} from '../../fixtures/isolatedSiteTest';
import {loginTest} from '../../fixtures/loginTest';
import {pageEditorPagesTest} from '../../fixtures/pageEditorPagesTest';
import {checkAccessibility} from '../../utils/checkAccessibility';
import getRandomString from '../../utils/getRandomString';
import getFragmentDefinition from './utils/getFragmentDefinition';
import getFragmentDropZoneDefinition from './utils/getFragmentDropZoneDefinition';
import getPageDefinition from './utils/getPageDefinition';

const test = mergeTests(
	apiHelpersTest,
	featureFlagsTest({
		'LPS-178052': true,
	}),
	isolatedSiteTest,
	loginTest(),
	pageEditorPagesTest
);

test('checks that the Tabs fragment works correctly', async ({
	apiHelpers,
	page,
	pageEditorPage,
	site,
}) => {
	const expectSelectedTabIsActive = async (name: string) => {
		const tabs = await page.locator('.nav-item').getByRole('tab').all();

		for (const tab of tabs) {
			const contentTab = (await tab.textContent()).trim();

			if (contentTab === name) {
				await expect(
					page.getByRole('tab', {name: contentTab})
				).toHaveAttribute('aria-selected', 'true');
				await expect(
					page.getByText(`${contentTab} - Panel`)
				).toBeVisible();
			}
			else {
				await expect(
					page.getByRole('tab', {name: contentTab})
				).toHaveAttribute('aria-selected', 'false');
				await expect(
					page.getByText(`${contentTab} - Panel`)
				).not.toBeVisible();
			}
		}
	};

	const getHeadingFragment = (content) =>
		getFragmentDefinition({
			fragmentFields: [
				{
					id: 'element-text',
					value: {
						text: {
							value_i18n: {
								en_US: content,
							},
						},
					},
				},
			],
			id: getRandomString(),
			key: 'BASIC_COMPONENT-heading',
		});

	// Create page and go to view mode

	const tabsId = getRandomString();

	const tabsDefinition = getFragmentDefinition({
		fragmentConfig: {
			numberOfTabs: 2,
			persistSelectedTab: true,
		},
		fragmentFields: [
			{
				id: 'title1',
				value: {},
			},
			{
				id: 'title2',
				value: {},
			},
		],
		id: tabsId,
		key: 'BASIC_COMPONENT-tabs',
		pageElements: [
			getFragmentDropZoneDefinition({
				fragmentDropZoneId: '1',
				id: getRandomString(),
				pageElements: [getHeadingFragment('Tab 1 - Panel')],
			}),
			getFragmentDropZoneDefinition({
				fragmentDropZoneId: '2',
				id: getRandomString(),
				pageElements: [getHeadingFragment('Tab 2 - Panel')],
			}),
		],
	});

	const layout = await apiHelpers.headlessDelivery.createSitePage({
		pageDefinition: getPageDefinition([tabsDefinition]),
		siteId: site.id,
		title: getRandomString(),
	});

	await page.goto(`/web${site.friendlyUrlPath}${layout.friendlyUrlPath}`);

	// Click in the second tab and check that the selected tab is active

	await expectSelectedTabIsActive('Tab 1');

	await page.getByRole('tab', {name: 'Tab 2'}).click();

	await expectSelectedTabIsActive('Tab 2');

	// Refresh the page and check that the active tab persists

	await page.goto(`/web${site.friendlyUrlPath}${layout.friendlyUrlPath}`);

	await expectSelectedTabIsActive('Tab 2');

	// Go to edit mode

	await pageEditorPage.goto(layout, site.friendlyUrlPath);

	// Change the number of tabs

	const tab = await page.locator('.component-tabs .nav-item');

	expect(await tab.all()).toHaveLength(2);

	await pageEditorPage.changeFragmentConfiguration({
		fieldLabel: 'Number of Tabs',
		fragmentId: tabsId,
		tab: 'General',
		value: '3',
	});

	expect(await tab.all()).toHaveLength(3);

	// Change persist selected tab

	await pageEditorPage.changeFragmentConfiguration({
		fieldLabel: 'Persist Selected Tab',
		fragmentId: tabsId,
		tab: 'General',
		value: false,
	});

	await pageEditorPage.publishPage();

	// Go to view mode and select the second tab

	await page.goto(`/web${site.friendlyUrlPath}${layout.friendlyUrlPath}`);

	await page.getByRole('tab', {name: 'Tab 2'}).click();

	// Refresh the page and check that the active tab is not persist

	await page.goto(`/web${site.friendlyUrlPath}${layout.friendlyUrlPath}`);

	await expectSelectedTabIsActive('Tab 1');

	// // Set small resolution

	// await page.setViewportSize({height: 600, width: 600});

	await page.waitForTimeout(1000);
});

test('checks that the Tabs fragment works correctly and has the correct semantics in small resolution', async ({
	apiHelpers,
	page,
	site,
}) => {
	const tabsDefinition = getFragmentDefinition({
		fragmentConfig: {
			numberOfTabs: 2,
		},
		fragmentFields: [
			{
				id: 'title1',
				value: {},
			},
			{
				id: 'title2',
				value: {},
			},
		],
		id: getRandomString(),
		key: 'BASIC_COMPONENT-tabs',
	});

	const layout = await apiHelpers.headlessDelivery.createSitePage({
		pageDefinition: getPageDefinition([tabsDefinition]),
		siteId: site.id,
		title: getRandomString(),
	});

	// Set small resolution and go to view mode

	await page.setViewportSize({height: 600, width: 600});

	await page.goto(`/web${site.friendlyUrlPath}${layout.friendlyUrlPath}`);

	let dropdownButton = page.getByLabel('Current Selection: Tab 1');

	await expect(dropdownButton).toHaveAttribute('aria-activedescendant', '');
	await expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');
	await expect(dropdownButton).toHaveAttribute('aria-haspopup', 'listbox');
	await expect(dropdownButton).toHaveAttribute('role', 'combobox');

	// Open the dropdown and navigate by keyboard to select the Tab 2

	await dropdownButton.press('Enter');

	await expect(dropdownButton).toHaveAttribute('aria-expanded', 'true');

	await page.keyboard.press('Tab');
	await page.keyboard.press('Tab');
	await page.keyboard.press('Enter');

	dropdownButton = page.getByLabel('Current Selection: Tab 2');

	// Check that the button has the correct text and the focus when the tab is selected

	expect((await dropdownButton.textContent()).trim()).toBe('Tab 2');

	await expect(dropdownButton).toBeFocused();

	// Check accessibility

	await checkAccessibility({page, selectors: ['.component-tabs']});
});
