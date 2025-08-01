/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import '@testing-library/jest-dom/extend-expect';

// eslint-disable-next-line
import {checkAccessibility} from '@liferay/layout-js-components-web/test/__lib__/index';
import {datetimeUtils} from '@liferay/object-js-components-web';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import React, {RefObject} from 'react';

import SchedulePanel from '../../../../../src/main/resources/META-INF/resources/js/content_editor/components/panels/SchedulePanel';

const dateConfig = datetimeUtils.generateDateConfigurations({
	defaultLanguageId: Liferay.ThemeDisplay.getDefaultLanguageId(),
	locale: Liferay.ThemeDisplay.getLanguageId(),
	type: 'DateTime',
});

const createInput = (name: string, value?: string) => {
	const input = document.createElement('input');

	input.name = name;

	if (value) {
		input.value = value;
		input.dataset.value = value;
	}

	return input;
};

const renderComponent = ({
	expirationDateInput = createInput('expirationDate'),
	reviewDateInput = createInput('reviewDate'),
}: {
	expirationDateInput?: HTMLInputElement;
	reviewDateInput?: HTMLInputElement;
} = {}) => {
	const expirationDateInputRef: RefObject<HTMLInputElement> = {
		current: expirationDateInput,
	};
	const reviewDateInputRef: RefObject<HTMLInputElement> = {
		current: reviewDateInput,
	};

	return render(
		<SchedulePanel
			dateConfig={dateConfig}
			expirationDateInputRef={expirationDateInputRef}
			reviewDateInputRef={reviewDateInputRef}
		/>
	);
};

describe('SchedulePanel', () => {
	beforeAll(() => {
		global.Liferay = {
			...global.Liferay,
			Language: {
				...global.Liferay?.Language,
				get: (key: string) => key,
			},
			ThemeDisplay: {
				...global.Liferay?.ThemeDisplay,
				getBCP47LanguageId: jest.fn(),
				getTimeZone: jest.fn(),
			},
		};
	});

	it('renders SchedulePanel', async () => {
		const {container} = renderComponent();

		expect(
			screen.getByRole('textbox', {name: 'expiration-date'})
		).toBeDisabled();
		expect(
			screen.getByRole('textbox', {name: 'review-date'})
		).toBeDisabled();

		const neverExpireCheckbox = screen.getAllByLabelText('never-expire');

		expect(neverExpireCheckbox[0]).toBeChecked();
		expect(neverExpireCheckbox[1]).toBeChecked();

		await checkAccessibility({context: container});
	});

	it('renders date inputs with initial values', async () => {
		renderComponent({
			expirationDateInput: createInput(
				'expirationDate',
				'2025-07-08T00:00'
			),
			reviewDateInput: createInput('reviewDate', '2025-07-09T00:00'),
		});

		const neverExpireCheckboxs = screen.getAllByLabelText('never-expire');

		expect(neverExpireCheckboxs[0]).not.toBeChecked();
		expect(neverExpireCheckboxs[1]).not.toBeChecked();

		const expirationInput: HTMLInputElement = screen.getByRole('textbox', {
			name: 'expiration-date',
		});
		const reviewInput: HTMLInputElement = screen.getByRole('textbox', {
			name: 'review-date',
		});

		expect(expirationInput.value).toBe('2025-07-08T00:00');
		expect(expirationInput).not.toBeDisabled();

		expect(reviewInput.value).toBe('2025-07-09T00:00');
		expect(reviewInput).not.toBeDisabled();
	});

	it('enables the date input when the Never Expire checkbox is unchecked', async () => {
		renderComponent();

		const expirationInput: HTMLInputElement = screen.getByRole('textbox', {
			name: 'expiration-date',
		});
		const neverExpireCheckbox = screen.getAllByLabelText('never-expire')[0];

		expect(neverExpireCheckbox).toBeChecked();
		expect(expirationInput).toBeDisabled();

		await userEvent.click(neverExpireCheckbox);

		await waitFor(() => {
			expect(neverExpireCheckbox).not.toBeChecked();
			expect(expirationInput).not.toBeDisabled();
		});
	});

	it('shows an error when an input value is invalid', async () => {
		renderComponent();

		const expirationInput: HTMLInputElement = screen.getByRole('textbox', {
			name: 'expiration-date',
		});
		const neverExpireCheckbox = screen.getAllByLabelText('never-expire')[0];

		await userEvent.click(neverExpireCheckbox);

		await waitFor(() => {
			expect(expirationInput).not.toBeDisabled();
		});

		await userEvent.type(expirationInput, '123');
		await userEvent.tab();

		await waitFor(() => {
			expect(
				screen.getByText('the-field-value-is-invalid')
			).toBeInTheDocument();
		});

		await userEvent.clear(expirationInput);
		await userEvent.tab();

		await waitFor(() => {
			expect(
				screen.queryByText('the-field-value-is-invalid')
			).not.toBeInTheDocument();
		});
	});

	it('shows an error when a date input value is a past value', async () => {
		renderComponent();

		const {momentFormat, serverFormat} = dateConfig;

		const toMomentDate = (value: string) => {
			return moment(value, serverFormat, true).format(momentFormat);
		};

		const expirationInput: HTMLInputElement = screen.getByRole('textbox', {
			name: 'expiration-date',
		});
		const neverExpireCheckbox = screen.getAllByLabelText('never-expire')[0];

		await userEvent.click(neverExpireCheckbox);

		await waitFor(() => {
			expect(expirationInput).not.toBeDisabled();
		});

		let expirationDate = toMomentDate('2024-07-09 00:00');

		await userEvent.type(expirationInput, expirationDate);
		await userEvent.tab();

		await waitFor(() => {
			expect(
				screen.getByText('the-date-entered-is-in-the-past')
			).toBeInTheDocument();
		});

		const nextYear = new Date().getFullYear() + 1;

		expirationDate = toMomentDate(`${nextYear}-07-09 00:00`);

		await userEvent.clear(expirationInput);
		await userEvent.type(expirationInput, expirationDate);
		await userEvent.tab();

		await waitFor(() => {
			expect(
				screen.queryByText('the-date-entered-is-in-the-past')
			).not.toBeInTheDocument();
			expect(
				screen.queryByText('the-field-value-is-invalid')
			).not.toBeInTheDocument();
		});
	});
});
