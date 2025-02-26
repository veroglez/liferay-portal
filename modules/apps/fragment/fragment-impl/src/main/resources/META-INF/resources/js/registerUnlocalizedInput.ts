/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

type Args = {
	defaultLanguageId: Liferay.Language.Locale;
	inputElement?: HTMLInputElement | HTMLInputElement[];
	onLocaleChange?: (languageId: string) => void;
	readOnlyInputLabel?: HTMLSpanElement;
	textDirection: 'ltr' | 'rtl';
	unlocalizedFieldsState: 'disabled' | 'read-only';
	unlocalizedMessageContainer: HTMLElement;
};

export function registerUnlocalizedInput({
	defaultLanguageId,
	inputElement,
	onLocaleChange,
	readOnlyInputLabel,
	textDirection,
	unlocalizedFieldsState,
	unlocalizedMessageContainer,
}: Args) {
	const isMultiselectField = Array.isArray(inputElement);
	const inputElements = isMultiselectField ? inputElement : [inputElement];

	if (!isMultiselectField && textDirection) {
		inputElement?.setAttribute('dir', textDirection);
	}

	Liferay.on(
		'localizationSelect:localeChanged',
		({languageId}: {languageId: Liferay.Language.Locale}) => {
			onLocaleChange?.(languageId);

			if (!isMultiselectField && textDirection) {
				inputElement?.setAttribute(
					'dir',
					Liferay.Language.direction[languageId]!
				);
			}

			if (languageId === defaultLanguageId) {
				if (unlocalizedFieldsState === 'disabled') {
					inputElements.forEach((input) => {
						input?.removeAttribute('disabled');
					});
				}
				else {
					if (!isMultiselectField) {
						inputElement?.removeAttribute('readonly');
					}

					readOnlyInputLabel?.classList.add('d-none');
				}

				unlocalizedMessageContainer?.classList.add('d-none');
			}
			else {
				if (unlocalizedFieldsState === 'disabled') {
					inputElements.forEach((input) => {
						input?.setAttribute('disabled', '');
					});

					if (!isMultiselectField) {
						inputElement?.closest('form')?.addEventListener(
							'submit',
							() => {
								inputElement?.removeAttribute('disabled');
							},
							true
						);
					}
				}
				else {
					if (!isMultiselectField) {
						inputElement?.setAttribute('readonly', '');
					}

					readOnlyInputLabel?.classList.remove('d-none');
				}

				unlocalizedMessageContainer.classList.remove('d-none');
			}
		}
	);
}
