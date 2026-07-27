/**
 * SPDX-FileCopyrightText: (c) 2026 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom';

// eslint-disable-next-line @liferay/portal/no-cross-module-deep-import
import {checkAccessibility} from '@liferay/layout-js-components-web/test/__lib__/index';
import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, {useEffect, useState} from 'react';

import EditCategoryGeneralInfoTab from '../../../../../../src/main/resources/META-INF/resources/js/main_view/categorization/categories/components/EditCategoryGeneralInfoTab';

const CATEGORY_FRIENDLY_URL_BASE = 'http://localhost:8080/web/cms/v/topics/';

const DEFAULT_LANGUAGE_ID = 'en_US';

const LOCALES = [
	{
		id: 'en_US',
		label: 'en-US',
		name: 'English (United States)',
		symbol: 'en-us',
	},
];

function renderComponent(category: Partial<TaxonomyCategory> = {}) {
	const onCategoryChange = jest.fn();

	const EditCategoryGeneralInfoTabWrapper = () => {
		const [currentCategory, setCurrentCategory] =
			useState<TaxonomyCategory>({
				name: '',
				name_i18n: {'en-US': ''},
				...category,
			});

		useEffect(() => {
			onCategoryChange(currentCategory);
		}, [currentCategory]);

		return (
			<EditCategoryGeneralInfoTab
				category={currentCategory}
				categoryFriendlyURLBase={CATEGORY_FRIENDLY_URL_BASE}
				defaultLanguageId={DEFAULT_LANGUAGE_ID}
				locales={LOCALES}
				nameInputError=""
				setCategory={setCurrentCategory}
				setCategoryPermissions={jest.fn()}
				setNameInputError={jest.fn()}
				showPermissions={false}
				spritemap="/sprite.svg"
			/>
		);
	};

	return {
		...render(<EditCategoryGeneralInfoTabWrapper />),
		onCategoryChange,
	};
}

describe('EditCategoryGeneralInfoTab', () => {
	it('shows the friendly URL of the category being edited', () => {
		renderComponent({
			friendlyUrlPath: 'sports',
			friendlyUrlPath_i18n: {'en-US': 'sports'},
			name: 'Sports',
			name_i18n: {'en-US': 'Sports'},
		});

		expect(screen.getByLabelText('friendly-url')).toHaveValue('sports');
		expect(
			screen.getByText(CATEGORY_FRIENDLY_URL_BASE)
		).toBeInTheDocument();
	});

	it('leaves the friendly URL empty for a new category', () => {
		renderComponent();

		expect(screen.getByLabelText('friendly-url')).toHaveValue('');
	});

	it('updates the friendly URL of the default language when it is edited', async () => {
		const {onCategoryChange} = renderComponent({
			friendlyUrlPath: 'sports',
			friendlyUrlPath_i18n: {'en-US': 'sports'},
			name: 'Sports',
			name_i18n: {'en-US': 'Sports'},
		});

		const friendlyURLInput = screen.getByLabelText('friendly-url');

		await userEvent.clear(friendlyURLInput);
		await userEvent.type(friendlyURLInput, 'team-sports');

		expect(friendlyURLInput).toHaveValue('team-sports');

		expect(onCategoryChange).toHaveBeenLastCalledWith(
			expect.objectContaining({
				friendlyUrlPath: 'team-sports',
				friendlyUrlPath_i18n: {'en-US': 'team-sports'},
			})
		);
	});

	it('disables the friendly URL of a system category', () => {
		renderComponent({
			friendlyUrlPath: 'sports',
			friendlyUrlPath_i18n: {'en-US': 'sports'},
			name: 'Sports',
			name_i18n: {'en-US': 'Sports'},
			system: true,
		});

		expect(screen.getByLabelText('friendly-url')).toBeDisabled();
	});

	it('has no accessibility violations', async () => {
		const {container} = renderComponent({
			friendlyUrlPath: 'sports',
			friendlyUrlPath_i18n: {'en-US': 'sports'},
			name: 'Sports',
			name_i18n: {'en-US': 'Sports'},
		});

		await checkAccessibility({bestPractices: true, context: container});
	});
});
