import React, { Component } from 'react';
import { fetchMovie } from "../actions/movieActions";
import { connect } from 'react-redux';
import {
  Card,
  ListGroup,
  ListGroupItem,
  Image,
  Form,
  Button
} from 'react-bootstrap';
import { BsStarFill } from 'react-icons/bs';
const env = process.env;

class MovieDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rating: '',
      reviewText: ''
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (!this.props.selectedMovie) {
      dispatch(fetchMovie(this.props.movieId));
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (!token) {
      alert("Please sign in to submit a review.");
      return;
    }

//     console.log("Submitting review with:");
// console.log("movieId:", this.props.selectedMovie?._id);
// console.log("rating:", this.state.rating);
// console.log("review:", this.state.reviewText);
// console.log("token:", token);


    fetch(`${env.REACT_APP_API_URL}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({
        movieId: this.props.selectedMovie._id,
        username: username,
        review: this.state.reviewText,
        rating: Number(this.state.rating)
      })
    })
      .then(res => res.json())
      .then(data => {
        alert("Review submitted!");
        this.setState({ rating: '', reviewText: '' });
        this.props.dispatch(fetchMovie(this.props.movieId));
      })
      .catch(err => console.error("Error submitting review:", err));
  };

  render() {
    const movie = this.props.selectedMovie;

    if (!movie) {
      return <div>Loading...</div>;
    }

    return (
      <Card>
        <Card.Header>Movie Detail</Card.Header>

        <Card.Body>
          <Image
            className="image"
            src={movie.imageUrl || "https://via.placeholder.com/300"}
            thumbnail
            alt={movie.title}
          />
        </Card.Body>

        <ListGroup>
          <ListGroupItem>
            {Array.isArray(movie.actors) ? (
              movie.actors.map((actor, i) => (
                <p key={i}><b>{actor.actorName}</b> as {actor.characterName}</p>
              ))
            ) : (
              <p>No actor data available</p>
            )}
          </ListGroupItem>
          <ListGroupItem>
            <h4><BsStarFill /> {movie.avgRating?.toFixed(1) || "No rating"}</h4>
          </ListGroupItem>
        </ListGroup>

        <Card.Body>
          <h5>Reviews</h5>
          {Array.isArray(movie.movieReviews) && movie.movieReviews.length > 0 ? (
            movie.movieReviews.map((review, i) => (
              <p key={i}>
                <b>{review.username}</b>: {review.review} <BsStarFill /> {review.rating}
              </p>
            ))
          ) : (
            <p>No reviews yet</p>
          )}
        </Card.Body>

        <Card.Body>
          <h5>Submit a Review</h5>
          <Form onSubmit={this.handleSubmit}>
            <Form.Group controlId="rating">
              <Form.Label>Rating (1-5)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="5"
                value={this.state.rating}
                onChange={(e) => this.setState({ rating: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group controlId="reviewText">
              <Form.Label>Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={this.state.reviewText}
                onChange={(e) => this.setState({ reviewText: e.target.value })}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="mt-2">
              Submit Review
            </Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedMovie: state.movie.selectedMovie
});

export default connect(mapStateToProps)(MovieDetail);