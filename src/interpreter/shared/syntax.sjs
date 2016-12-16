//TODO: Add Tests
operator (|) 13 left { $l, $r } => #{ _.pipeline($l, $r) }
export (|)

operator (|>) 5 right { $l, $r } => #{ $l | writeFile($r)}
export (|>)

macro flag {
	case {_ /$arg:ident} => {
		letstx $tok_str = [makeValue('/' + unwrapSyntax(#{$arg}), #{ here })];
		return #{$tok_str}
	}
	case {_ --$arg1-$arg2:ident } => {
		letstx $tok_str = [makeValue(
			'--' + unwrapSyntax(#{$arg1}) +
			'-' + unwrapSyntax(#{$arg2}),
			#{ here }
		)];
		return #{$tok_str}
	}
	case {_ -$arg:ident } => {
		letstx $tok_str = [makeValue('-' + unwrapSyntax(#{$arg}), #{ here })];
		return #{$tok_str}
	}
	case {_ --$arg:ident } => {
		letstx $tok_str = [makeValue('--' + unwrapSyntax(#{$arg}), #{ here })];
		return #{$tok_str}
	}
}

macro paramflag {
	case {_ $flag:flag=$arg:lit} => {
		letstx $tok_str = [makeValue(
			unwrapSyntax(#{$flag}) +
			'=' +
			unwrapSyntax(#{$arg}), #{ here }
		)];
		return #{$tok_str}
	}
}

macro arg {
	case {_ {{$arg:expr ...}} } => {
		return #{($arg ...)}
	}
	case {_ $arg:paramflag } => {
		return #{$arg}
	}
	case {_ $arg:ident } => {
		letstx $tok_str = [makeValue(unwrapSyntax(#{$arg}), #{ here })];
		return #{$tok_str}
	}
	case {_ $arg:lit } => {
		letstx $tok_str = [makeValue(unwrapSyntax(#{$arg}), #{ here })];
		return #{$tok_str}
	}
	case {_ $arg:flag } => {
		return #{$arg}
	}
}

/*macro strlist {
	case { _ $toks ... } => {
		return [makeValue(#{ $toks ... }.map(unwrapSyntax).join(','), #{ here })];
	}
}*/

macro (&) {
	case {_ $func:ident $args:arg ...} => {
		return #{
			$func($args (,) ...)
		}
	}
}

export (&)
