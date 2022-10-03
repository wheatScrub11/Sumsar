
function Comment(props) {
    const {comment} = props


  return (
    <div className="comment-container">
      <div className="comment">
        <img src={comment.whoCommentedPfpUrl} className={"user-pfp"} />
        <div className="profile">
          <div className="profile-identification">
            <div className="username">{comment.whoCommentedUsername}</div>
          </div>
        </div>
        <div className="description">{comment.commentDescription}</div>
        <div className="post-dates">
          <p>
            {comment.commentDate.formatAMPM} - {comment.commentDate.formatDMY}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Comment;
