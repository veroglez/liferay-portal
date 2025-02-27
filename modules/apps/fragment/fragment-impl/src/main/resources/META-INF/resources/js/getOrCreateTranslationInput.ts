/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

export default function getOrCreateTranslationInput(
	inputId: string,
	inputName: string,
	languageId: string,
	localizationInputsContainer: HTMLElement,
	namespace: string,
	type: 'file' | 'hidden' = 'hidden'
) {
	const id = `${namespace}${inputId}_${languageId}`;

	let translationInput = document.getElementById(id) as HTMLInputElement;

	if (!translationInput) {
		translationInput = document.createElement('input');
		translationInput.type = type;
		translationInput.id = id;
		translationInput.name = `${inputName}_${languageId}`;
		translationInput.className = 'd-none';
		localizationInputsContainer.appendChild(translationInput);
	}
	else if (translationInput.type === 'hidden' && type === 'file') {
		translationInput.value = '';
		translationInput.type = 'file';
	}

	return translationInput;
}
