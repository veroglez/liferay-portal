/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import getOrCreateTranslationInput from './getOrCreateTranslationInput';

function getTranslationInput(
	namespace: string,
	languageId: string,
	inputName: string
) {
	const inputId = `${namespace}${inputName}-file-upload_${languageId}`;

	return document.getElementById(inputId) as HTMLInputElement;
}

export function onChangeFileUploadInput({
	fileName,
	inputName,
	isFromDocumentLibrary,
	languageId,
	localizationInputsContainer,
	namespace,
	value,
}: {
	fileName?: string;
	inputName: string;
	isFromDocumentLibrary: boolean;
	languageId: Liferay.Language.Locale;
	localizationInputsContainer: HTMLElement;
	namespace: string;
	value: FileList | string;
}) {
	const type = isFromDocumentLibrary === false ? 'file' : 'hidden';

	const translationInput = getOrCreateTranslationInput(
		`${inputName}-file-upload`,
		inputName,
		languageId,
		localizationInputsContainer,
		namespace,
		type
	);

	if (isFromDocumentLibrary) {
		translationInput.value = value as string;
		translationInput.dataset.fileName = fileName;
	}
	else {
		const files = value as FileList;

		if (files?.length) {
			const dataTransfer = new DataTransfer();

			if (files?.length) {
				[...files].forEach((file) => {
					dataTransfer.items.add(file);
				});
			}

			translationInput.files = dataTransfer.files;
			translationInput.dataset.fileName = dataTransfer.files[0].name;
		}
	}
}

export function onChangeMultiselectInput(
	inputElements: HTMLInputElement[],
	languageId: Liferay.Language.Locale,
	namespace: string
) {
	inputElements.forEach((inputElement) => {
		const translationInput = getOrCreateTranslationInput(
			inputElement.id,
			inputElement.name,
			languageId,
			inputElement.parentNode as HTMLElement,
			namespace
		);

		translationInput.value = inputElement.checked ? inputElement.value : '';
	});
}
export function onLocaleChangeFileUploadInput({
	defaultLanguageId,
	inputName,
	languageId,
	namespace,
	onLocaleChange,
}: {
	defaultLanguageId: Liferay.Language.Locale;
	inputName: string;
	languageId: Liferay.Language.Locale;
	namespace: string;
	onLocaleChange: (input: HTMLInputElement) => void;
}) {
	const translationInput = getTranslationInput(
		namespace,
		languageId,
		inputName
	);

	if (translationInput) {
		onLocaleChange(translationInput);
	}
	else {
		const defaultTranslationInput = getTranslationInput(
			namespace,
			defaultLanguageId,
			inputName
		);

		onLocaleChange(defaultTranslationInput);
	}
}

export function onLocaleChangeMultiselectInput({
	defaultLanguageId,
	inputElements,
	languageId,
	namespace,
}: {
	defaultLanguageId: Liferay.Language.Locale;
	inputElements: HTMLInputElement[];
	languageId: Liferay.Language.Locale;
	namespace: string;
}) {
	inputElements.forEach((inputElement, index) => {
		const translationInput = getOrCreateTranslationInput(
			inputElement.id,
			inputElement.name,
			languageId,
			inputElement.parentNode as HTMLElement,
			namespace
		);

		if (index !== 0) {
			translationInput.setAttribute('data-multiselect', 'true');
		}

		if (translationInput.getAttribute('value') !== null) {
			if (inputElement) {
				inputElement.checked = Boolean(translationInput.value);
			}
		}
		else {
			const defaultLanguageInput = getOrCreateTranslationInput(
				inputElement.id,
				inputElement.name,
				defaultLanguageId,
				inputElement.parentNode as HTMLElement,
				namespace
			);

			if (defaultLanguageInput) {
				inputElement.checked = Boolean(defaultLanguageInput.value);
			}
		}
	});
}

export function onRemoveFileFromFileUploadInput({
	inputName,
	languageId,
	localizationInputsContainer,
	namespace,
}: {
	inputName: string;
	languageId: Liferay.Language.Locale;
	localizationInputsContainer: HTMLElement;
	namespace: string;
}) {
	const translationInput = getOrCreateTranslationInput(
		`${inputName}-file-upload`,
		inputName,
		languageId,
		localizationInputsContainer,
		namespace
	);

	translationInput.value = '';
	translationInput.dataset.fileName = '';
}

export function setInitialValuesMultiselectInput(
	initialValues: Record<string, any>,
	inputElements: HTMLInputElement[],
	namespace: string
) {
	inputElements.forEach((inputElement, index) => {
		Object.entries(initialValues).forEach(([languageId, value]) => {
			const input = getOrCreateTranslationInput(
				inputElement.id,
				inputElement.name,
				languageId,
				inputElement.parentNode as HTMLElement,
				namespace
			);

			if (index !== 0) {
				input.setAttribute('data-multiselect', 'true');
			}

			input.value = value.includes(inputElement.value)
				? inputElement.value
				: '';
		});
	});
}
