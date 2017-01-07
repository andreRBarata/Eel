//TODO: Add Tests
operator (|) 13 left { $l, $r } => #{ _.pipeline($l, $r) }
export (|)

operator (|>) 5 right { $l, $r } => #{ $l | writeFile($r)}
export (|>)

macro (-) {
	case { --$arg:unwrap } => {
		return #{'--' + $arg}
	}
	case { -$arg:unwrap } => {
		return #{'-' + $arg}
	}
	case infix { $arg1 | _ $arg2 } => {
		return #{$arg1 + '-' + $arg2}
	}
}

macro unwrap {
	rule {_ . } => {
		'.'
	}
	rule {_ / } => {
		'/'
	}
	case {_ $arg:lit } => {
		return [makeValue(unwrapSyntax(#{$arg}), #{ here })];
	}
}

/*
macro word {
	rule { .$rest:invoke(word) } => {
		'.' + $rest
	}
	rule { -$rest:invoke(word) } => {
		'-' + $rest
	}
	rule { --$rest:invoke(word) } => {
		'--' + $rest
	}
	rule { =$rest:invoke(word) } => {
		'=' + $rest
	}
	rule { $arg:invoke(unwrap)$rest:invoke(word) } => {
		($arg) + $rest
	}
	rule { $arg:invoke(unwrap)} => {
		$arg
	}
}*/

macro word {
	case {_ $args ... } => {
		let val = #{$args ...}.map(unwrapSyntax).join('');
		console.log(val);

		return [makeValue(val, #{ here })];
	}
}

/*
macro (&) {
	case {_ $args:unwrap ... ...} => {
		console.log(#{$args ... (,) ...});/*.map((e) => {
			 e.map(unwrapSyntax)
			})
		);


		return #{system['ls']($args (,) ...)};
	}
}*/
