/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {
	onChangeMultiselectInput,
	onLocaleChangeMultiselectInput,
	setInitialValuesMultiselectInput,
} from './fileUploadAndMultiselectHandlers';
import getOrCreateTranslationInput from './getOrCreateTranslationInput';

type Args = {
	defaultLanguageId: Liferay.Language.Locale;
	initialValues: Record<string, any>;
	inputElement?: HTMLInputElement | HTMLInputElement[];
	inputName: string;
	isFromDocumentLibrary: boolean | null;
	localizationInputsContainer: HTMLElement;
	namespace: string;
	onLocaleChange?: ({
		languageId,
		value,
	}: {
		languageId: string;
		value: string;
	}) => void;
	optionValues: Record<string, string>;
	textDirection?: 'ltr' | 'rtl';
};

export function registerLocalizedInput({
	defaultLanguageId,
	initialValues,
	inputElement,
	inputName,
	isFromDocumentLibrary = null,
	localizationInputsContainer,
	namespace,
	onLocaleChange,
	optionValues,
	textDirection,
}: Args) {
	const isMultiselectField = Array.isArray(inputElement);
	const isFileUploadInput = isFromDocumentLibrary !== null;

	let currentLanguageId = defaultLanguageId;

	if (initialValues) {
		if (isMultiselectField) {
			setInitialValuesMultiselectInput(
				initialValues,
				inputElement,
				namespace
			);
		}
		else {
			Object.entries(initialValues).forEach(([languageId, value]) => {
				const input = getOrCreateTranslationInput(
					inputElement?.id || inputName,
					inputName,
					languageId,
					localizationInputsContainer,
					namespace
				);

				if (isFileUploadInput) {
					input.value = value.fileEntryId;
					input.dataset.fileName = value.name;
				}
				else {
					input.value = value;

					if (optionValues) {
						input.dataset.label = optionValues[value];
					}
				}
			});
		}
	}

	if (!isMultiselectField && textDirection) {
		inputElement?.setAttribute('dir', textDirection);
	}

	Liferay.on(
		'localizationSelect:localeChanged',
		({languageId}: {languageId: Liferay.Language.Locale}) => {
			currentLanguageId = languageId;

			if (isMultiselectField) {
				onLocaleChangeMultiselectInput({
					defaultLanguageId,
					inputElements: inputElement,
					languageId,
					namespace,
				});
			}
			else {
				const translationInput = getOrCreateTranslationInput(
					inputElement?.id || inputName,
					inputName,
					languageId,
					localizationInputsContainer,
					namespace
				);

				if (translationInput.getAttribute('value') !== null) {
					onLocaleChange?.({
						languageId,
						value: translationInput.value,
					});

					if (!inputElement) {
						return;
					}

					if (inputElement.type === 'checkbox') {
						inputElement.checked =
							translationInput.value === 'true';
					}
					else if (
						inputElement.getAttribute('role') === 'combobox'
					) {
						inputElement.value =
							translationInput.dataset.label || '';
					}
					else {
						inputElement.value = translationInput.value;
					}
				}
				else {
					const defaultLanguageInput = getOrCreateTranslationInput(
						inputElement?.id || inputName,
						inputName,
						defaultLanguageId,
						localizationInputsContainer,
						namespace
					);

					onLocaleChange?.({
						languageId,
						value: defaultLanguageInput.value,
					});

					if (!inputElement) {
						return;
					}

					if (inputElement.getAttribute('role') === 'combobox') {
						inputElement.value =
							defaultLanguageInput.dataset.label || '';
					}
					else {
						inputElement.value = defaultLanguageInput.value;
					}
				}
			}

			if (!isMultiselectField && textDirection) {
				inputElement?.setAttribute(
					'dir',
					Liferay.Language.direction[languageId]!
				);
			}
		}
	);

	return {
		onChange: (value: string, label?: string) => {
			if (isMultiselectField) {
				onChangeMultiselectInput(
					inputElement,
					currentLanguageId,
					namespace
				);
			}
			else {
				const translationInput = getOrCreateTranslationInput(
					inputElement?.id || inputName,
					inputName,
					currentLanguageId,
					localizationInputsContainer,
					namespace
				);

				translationInput.value = value;

				if (label) {
					translationInput.dataset.label = label;
				}
			}

			Liferay.fire('localizationSelect:updateTranslationStatus', {
				languageId: currentLanguageId,
			});
		},
	};
}
