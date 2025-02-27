/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import getOrCreateTranslationInput from './getOrCreateTranslationInput';

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
