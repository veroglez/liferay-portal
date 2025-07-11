/**
 * SPDX-FileCopyrightText: (c) 2025 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import ClayButton from '@clayui/button';
import {
	CKEditor5BalloonEditor,
	LiferayEditorConfig,
} from 'frontend-editor-ckeditor-web';
import {fetch, objectToFormData} from 'frontend-js-web';
import React, {useState} from 'react';

export type Comment = {
	author: {
		fullName: string;
		portraitURL: string;
		userId: string;
	};
	body: string;
	children: Comment[];
	className: string;
	commentId: string;
	dateDescription: string;
	edited: boolean;
	negativeVotes: number;
	positiveVotes: number;
};

export default function CommentsPanel({
	addCommentURL,
	comments: initialComments,
	editorConfig,
}: {
	addCommentURL: string;
	comments: Comment[];
	editorConfig: {configJSONObject: LiferayEditorConfig};
}) {
	const [comments, setComments] = useState<Comment[]>(initialComments);

	return (
		<>
			<div className="border-bottom pb-2 px-3">
				<label>{Liferay.Language.get('add-comment')}</label>

				<CommentEditor
					addCommentURL={addCommentURL}
					editorConfig={editorConfig.configJSONObject}
					onAddComment={(comment) =>
						setComments([...comments, {...comment, children: []}])
					}
				/>
			</div>
		</>
	);
}

function CommentEditor({
	addCommentURL,
	editorConfig,
	onAddComment,
	parentCommentId = null,
}: {
	addCommentURL: string;
	editorConfig: LiferayEditorConfig;
	onAddComment: (comment: Comment, parentId?: string) => void;
	onCancel?: () => void;
	parentCommentId?: string | null;
}) {
	const [content, setContent] = useState<string>();

	return (
		<>
			<CKEditor5BalloonEditor
				className="form-control form-control-sm"
				config={editorConfig}
				onChange={(_, editor) => {
					setContent(editor.getData());
				}}
			/>

			<div className="my-3">
				<ClayButton
					onClick={async () => {
						if (!content) {
							return;
						}

						const response = await fetch(addCommentURL, {
							body: objectToFormData({
								body: content,
								parentCommentId,
							}),
							method: 'POST',
						});

						const comment = await response.json();

						onAddComment(comment);
					}}
					size="sm"
				>
					{Liferay.Language.get('save')}
				</ClayButton>
			</div>
		</>
	);
}
